/**
 * Firebase Configuration - Standalone Version
 * Use this if the PHP version doesn't work
 * Replace firebase-config.js with this file
 */

// Your Firebase configuration (hardcoded)
const firebaseConfig = {
    apiKey: "AIzaSyAK73b172GFZb0EDcvv6CqMCrzTYAnQWvM",
    authDomain: "royal-shaadi-d2605.firebaseapp.com",
    projectId: "royal-shaadi-d2605",
    storageBucket: "royal-shaadi-d2605.firebasestorage.app",
    messagingSenderId: "236714305514",
    appId: "1:236714305514:web:a4b0441d387977d69db493",
    measurementId: "G-0BN8H58LK9"
};

// Initialize Firebase
let app, auth, db, analytics;

try {
    if (typeof firebase !== 'undefined') {
        // Initialize Firebase App
        app = firebase.initializeApp(firebaseConfig);
        
        // Initialize Firebase Services
        auth = firebase.auth();
        db = firebase.firestore();
        
        // Initialize Analytics (optional)
        if (firebaseConfig.measurementId) {
            analytics = firebase.analytics();
            console.log('Firebase Analytics initialized');
        }
        
        console.log('✅ Firebase initialized successfully');
        console.log('📱 Project:', firebaseConfig.projectId);
        
        // Setup Google Auth Provider
        window.googleProvider = new firebase.auth.GoogleAuthProvider();
        
        // Configure Firestore settings for better performance
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code == 'unimplemented') {
                    console.warn('The current browser doesn\'t support persistence.');
                }
            });
        
    } else {
        console.error('❌ Firebase library not loaded. Make sure Firebase scripts are included.');
    }
} catch (error) {
    console.error('❌ Error initializing Firebase:', error);
}

// Export for use in other files
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseAnalytics = analytics;

// Vendor data structure for Firestore
const VendorSchema = {
    id: '',
    name: '',
    category: '',
    description: '',
    location: '',
    priceRange: '',
    rating: 0,
    reviewCount: 0,
    phone: '',
    email: '',
    website: '',
    images: [],
    services: [],
    availability: {},
    createdAt: null,
    updatedAt: null,
    userId: '',
    verified: false,
    featured: false
};

// Helper function to sync WordPress vendor to Firebase
async function syncVendorToFirebase(vendorData) {
    if (!db) {
        console.error('Firestore not initialized');
        return;
    }
    
    try {
        const vendorRef = db.collection('vendors').doc(vendorData.id.toString());
        await vendorRef.set({
            ...vendorData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        console.log('✅ Vendor synced to Firebase:', vendorData.id);
        return true;
    } catch (error) {
        console.error('❌ Error syncing vendor to Firebase:', error);
        return false;
    }
}

// Helper function to get vendors from Firebase
async function getVendorsFromFirebase(filters = {}) {
    if (!db) {
        console.error('Firestore not initialized');
        return [];
    }
    
    try {
        let query = db.collection('vendors');
        
        // Apply filters
        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }
        
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        
        if (filters.verified) {
            query = query.where('verified', '==', true);
        }
        
        if (filters.featured) {
            query = query.where('featured', '==', true);
        }
        
        // Add ordering
        if (filters.orderBy) {
            query = query.orderBy(filters.orderBy, filters.order || 'desc');
        }
        
        // Add limit
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        
        const snapshot = await query.get();
        const vendors = [];
        
        snapshot.forEach(doc => {
            vendors.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Retrieved ${vendors.length} vendors from Firebase`);
        return vendors;
        
    } catch (error) {
        console.error('❌ Error getting vendors from Firebase:', error);
        return [];
    }
}

// Helper function to add vendor review
async function addVendorReview(vendorId, reviewData) {
    if (!db || !auth.currentUser) {
        console.error('Must be logged in to add review');
        return false;
    }
    
    try {
        const reviewRef = db.collection('vendors').doc(vendorId).collection('reviews').doc();
        
        await reviewRef.set({
            ...reviewData,
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName || 'Anonymous',
            userPhoto: auth.currentUser.photoURL || '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update vendor rating
        const vendorRef = db.collection('vendors').doc(vendorId);
        const vendor = await vendorRef.get();
        
        if (vendor.exists) {
            const vendorData = vendor.data();
            const newReviewCount = (vendorData.reviewCount || 0) + 1;
            const newRating = ((vendorData.rating || 0) * (vendorData.reviewCount || 0) + reviewData.rating) / newReviewCount;
            
            await vendorRef.update({
                rating: newRating,
                reviewCount: newReviewCount
            });
            
            console.log('✅ Review added successfully');
            
            // Log analytics event
            if (analytics) {
                analytics.logEvent('review_added', {
                    vendor_id: vendorId,
                    rating: reviewData.rating
                });
            }
            
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('❌ Error adding review:', error);
        return false;
    }
}

// Helper function to add to favorites
async function toggleFavoriteVendor(vendorId) {
    if (!db || !auth.currentUser) {
        console.error('Must be logged in to favorite vendors');
        return false;
    }
    
    try {
        const userRef = db.collection('users').doc(auth.currentUser.uid);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            // Create user document
            await userRef.set({
                displayName: auth.currentUser.displayName,
                email: auth.currentUser.email,
                favorites: [vendorId],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Vendor added to favorites');
            return true;
        }
        
        const userData = userDoc.data();
        const favorites = userData.favorites || [];
        
        if (favorites.includes(vendorId)) {
            // Remove from favorites
            await userRef.update({
                favorites: firebase.firestore.FieldValue.arrayRemove(vendorId)
            });
            console.log('✅ Vendor removed from favorites');
            return false;
        } else {
            // Add to favorites
            await userRef.update({
                favorites: firebase.firestore.FieldValue.arrayUnion(vendorId)
            });
            console.log('✅ Vendor added to favorites');
            
            // Log analytics event
            if (analytics) {
                analytics.logEvent('vendor_favorited', { vendor_id: vendorId });
            }
            
            return true;
        }
        
    } catch (error) {
        console.error('❌ Error toggling favorite:', error);
        return false;
    }
}

// Export functions
window.syncVendorToFirebase = syncVendorToFirebase;
window.getVendorsFromFirebase = getVendorsFromFirebase;
window.addVendorReview = addVendorReview;
window.toggleFavoriteVendor = toggleFavoriteVendor;

console.log('🔥 Firebase helper functions loaded');