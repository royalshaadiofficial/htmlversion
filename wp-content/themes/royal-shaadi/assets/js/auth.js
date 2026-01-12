/**
 * Firebase Authentication Handler - FIXED VERSION
 * Replace the existing auth.js with this file
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Auth script loaded');
    
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    
    if (!auth) {
        console.error('❌ Firebase Auth not initialized. Check firebase-config.js');
        return;
    }
    
    console.log('✅ Firebase Auth is available');
    
    // UI Elements
    const loggedOutState = document.getElementById('loggedOutState');
    const loggedInState = document.getElementById('loggedInState');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    
    // Auth state observer
    auth.onAuthStateChanged(async (user) => {
        console.log('🔄 Auth state changed:', user ? 'Logged in' : 'Logged out');
        
        if (user) {
            // User is signed in
            console.log('✅ User logged in:', user.email);
            
            if (loggedOutState) loggedOutState.classList.add('d-none');
            if (loggedInState) loggedInState.classList.remove('d-none');
            
            if (userName) userName.textContent = user.displayName || user.email.split('@')[0];
            if (userAvatar) {
                userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=667eea&color=fff`;
            }
            
            // Store user data in Firestore
            if (db) {
                try {
                    await db.collection('users').doc(user.uid).set({
                        displayName: user.displayName || user.email.split('@')[0],
                        email: user.email,
                        photoURL: user.photoURL,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    console.log('✅ User data saved to Firestore');
                } catch (error) {
                    console.error('❌ Error saving user data:', error);
                }
            }
            
            // Close modals
            closeAuthModals();
            
        } else {
            // User is signed out
            console.log('👤 No user logged in');
            if (loggedOutState) loggedOutState.classList.remove('d-none');
            if (loggedInState) loggedInState.classList.add('d-none');
        }
    });
    
    // Email/Password Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📧 Attempting email login...');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            try {
                errorDiv.classList.add('d-none');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
                
                console.log('🔑 Signing in with email:', email);
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                console.log('✅ Login successful:', userCredential.user.email);
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
                loginForm.reset();
                
                // Show success message
                showNotification('Welcome back!', 'success');
                
            } catch (error) {
                console.error('❌ Login error:', error.code, error.message);
                errorDiv.textContent = getErrorMessage(error.code);
                errorDiv.classList.remove('d-none');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
            }
        });
    } else {
        console.warn('⚠️ Login form not found');
    }
    
    // Email/Password Signup
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📝 Attempting signup...');
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const userTypeInput = document.querySelector('input[name="userType"]:checked');
            const userType = userTypeInput ? userTypeInput.value : 'couple';
            const errorDiv = document.getElementById('signupError');
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            
            try {
                errorDiv.classList.add('d-none');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating account...';
                
                console.log('👤 Creating user:', email, 'Type:', userType);
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                console.log('✅ User created:', userCredential.user.uid);
                
                // Update profile
                await userCredential.user.updateProfile({
                    displayName: name
                });
                console.log('✅ Profile updated with name:', name);
                
                // Store additional user data in Firestore
                if (db) {
                    await db.collection('users').doc(userCredential.user.uid).set({
                        displayName: name,
                        email: email,
                        userType: userType,
                        photoURL: null,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                        favorites: [],
                        role: userType === 'vendor' ? 'vendor' : 'user'
                    });
                    console.log('✅ User data saved to Firestore');
                }
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Sign Up';
                signupForm.reset();
                
                // Show success message
                showNotification('Account created successfully! Welcome to Royal Shaadi.', 'success');
                
            } catch (error) {
                console.error('❌ Signup error:', error.code, error.message);
                errorDiv.textContent = getErrorMessage(error.code);
                errorDiv.classList.remove('d-none');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Sign Up';
            }
        });
    } else {
        console.warn('⚠️ Signup form not found');
    }
    
    // Google Login
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('🔵 Attempting Google login...');
            
            try {
                const provider = window.googleProvider;
                if (!provider) {
                    console.error('❌ Google provider not found');
                    showNotification('Google sign-in not configured', 'error');
                    return;
                }
                
                console.log('🔵 Opening Google popup...');
                const result = await auth.signInWithPopup(provider);
                console.log('✅ Google login successful:', result.user.email);
                
                // Save to Firestore
                if (db) {
                    await db.collection('users').doc(result.user.uid).set({
                        displayName: result.user.displayName,
                        email: result.user.email,
                        photoURL: result.user.photoURL,
                        userType: 'couple',
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
                
                showNotification('Welcome! Logged in with Google.', 'success');
                
            } catch (error) {
                console.error('❌ Google login error:', error.code, error.message);
                
                if (error.code === 'auth/popup-closed-by-user') {
                    console.log('ℹ️ User closed the popup');
                } else if (error.code === 'auth/popup-blocked') {
                    showNotification('Please allow popups for this site', 'error');
                } else {
                    showNotification(getErrorMessage(error.code), 'error');
                }
            }
        });
    } else {
        console.warn('⚠️ Google login button not found');
    }
    
    // Google Signup
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('🔵 Attempting Google signup...');
            
            try {
                const provider = window.googleProvider;
                if (!provider) {
                    console.error('❌ Google provider not found');
                    showNotification('Google sign-in not configured', 'error');
                    return;
                }
                
                const userTypeInput = document.querySelector('input[name="userType"]:checked');
                const userType = userTypeInput ? userTypeInput.value : 'couple';
                
                console.log('🔵 Opening Google popup...');
                const result = await auth.signInWithPopup(provider);
                console.log('✅ Google signup successful:', result.user.email);
                
                // Store user type for new Google users
                if (db) {
                    const isNewUser = result.additionalUserInfo?.isNewUser;
                    await db.collection('users').doc(result.user.uid).set({
                        displayName: result.user.displayName,
                        email: result.user.email,
                        photoURL: result.user.photoURL,
                        userType: userType,
                        role: userType === 'vendor' ? 'vendor' : 'user',
                        createdAt: isNewUser ? firebase.firestore.FieldValue.serverTimestamp() : null,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    console.log('✅ User data saved');
                }
                
                showNotification('Welcome! Account created with Google.', 'success');
                
            } catch (error) {
                console.error('❌ Google signup error:', error.code, error.message);
                
                if (error.code === 'auth/popup-closed-by-user') {
                    console.log('ℹ️ User closed the popup');
                } else if (error.code === 'auth/popup-blocked') {
                    showNotification('Please allow popups for this site', 'error');
                } else {
                    showNotification(getErrorMessage(error.code), 'error');
                }
            }
        });
    } else {
        console.warn('⚠️ Google signup button not found');
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('🚪 Logging out...');
            
            try {
                await auth.signOut();
                console.log('✅ Logged out successfully');
                showNotification('Logged out successfully', 'success');
            } catch (error) {
                console.error('❌ Logout error:', error);
                showNotification('Error logging out. Please try again.', 'error');
            }
        });
    } else {
        console.warn('⚠️ Logout button not found');
    }
    
    // Helper function to close auth modals
    function closeAuthModals() {
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        
        if (loginModal && bootstrap && bootstrap.Modal) {
            const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
            if (loginModalInstance) loginModalInstance.hide();
        }
        
        if (signupModal && bootstrap && bootstrap.Modal) {
            const signupModalInstance = bootstrap.Modal.getInstance(signupModal);
            if (signupModalInstance) signupModalInstance.hide();
        }
    }
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} notification-toast`;
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(400px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Helper function to get user-friendly error messages
    function getErrorMessage(errorCode) {
        const messages = {
            'auth/email-already-in-use': 'This email is already registered. Please login instead.',
            'auth/invalid-email': 'Invalid email address.',
            'auth/operation-not-allowed': 'Operation not allowed. Please contact support.',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed.',
            'auth/cancelled-popup-request': 'Sign-in cancelled.',
            'auth/popup-blocked': 'Please allow popups for this site to sign in with Google.',
            'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in method.',
        };
        
        return messages[errorCode] || `An error occurred: ${errorCode}. Please try again.`;
    }
});

// Export current user getter
window.getCurrentUser = function() {
    return window.firebaseAuth ? window.firebaseAuth.currentUser : null;
};

console.log('✅ Auth script fully loaded');