/**
 * Planning Tools JavaScript
 * Handles wedding planning dashboard functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📅 Planning tools loaded');
    
    const auth = window.firebaseAuth;
    const db = window.firebaseDb;
    
    if (!auth) {
        console.error('Firebase Auth not available');
        return;
    }
    
    const authCheck = document.getElementById('authCheck');
    const planningDashboard = document.getElementById('planningDashboard');
    
    // Check authentication state
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('✅ User logged in, showing dashboard');
            authCheck.classList.add('d-none');
            planningDashboard.classList.remove('d-none');
            
            // Load user data
            await loadUserPlanningData(user.uid);
            updateGreeting(user);
        } else {
            console.log('❌ User not logged in');
            authCheck.classList.remove('d-none');
            planningDashboard.classList.add('d-none');
        }
    });
    
    // Update greeting
    function updateGreeting(user) {
        const greeting = document.getElementById('userGreeting');
        if (greeting) {
            const name = user.displayName || user.email.split('@')[0];
            greeting.textContent = `${name}'s`;
        }
    }
    
    // Load user planning data from Firestore
    async function loadUserPlanningData(userId) {
        if (!db) return;
        
        try {
            // Get user's wedding data
            const weddingDoc = await db.collection('weddings').doc(userId).get();
            
            if (weddingDoc.exists) {
                const weddingData = weddingDoc.data();
                
                // Update countdown
                if (weddingData.weddingDate) {
                    updateCountdown(weddingData.weddingDate);
                }
                
                // Load budget
                if (weddingData.budget) {
                    updateBudgetSummary(weddingData.budget);
                }
                
                // Load guest count
                if (weddingData.guests) {
                    updateGuestSummary(weddingData.guests);
                }
                
                // Load checklist
                if (weddingData.checklist) {
                    updateChecklistSummary(weddingData.checklist);
                }
            } else {
                console.log('No wedding data found, initializing...');
                await initializeWeddingData(userId);
            }
            
            // Load favorites count
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                if (userData.favorites) {
                    document.getElementById('favoriteVendors').textContent = userData.favorites.length;
                }
            }
            
        } catch (error) {
            console.error('Error loading planning data:', error);
        }
    }
    
    // Initialize wedding data for new users
    async function initializeWeddingData(userId) {
        if (!db) return;
        
        try {
            await db.collection('weddings').doc(userId).set({
                owners: [userId],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                budget: {
                    total: 0,
                    spent: 0,
                    categories: []
                },
                guests: {
                    total: 0,
                    confirmed: 0,
                    pending: 0,
                    list: []
                },
                checklist: {
                    total: 0,
                    completed: 0,
                    tasks: []
                }
            });
            console.log('✅ Wedding data initialized');
        } catch (error) {
            console.error('Error initializing wedding data:', error);
        }
    }
    
    // Update countdown
    function updateCountdown(weddingDate) {
        const countdownEl = document.getElementById('countdownDays');
        if (!countdownEl) return;
        
        const wedding = weddingDate.toDate ? weddingDate.toDate() : new Date(weddingDate);
        const today = new Date();
        const daysUntil = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil > 0) {
            countdownEl.textContent = daysUntil;
        } else if (daysUntil === 0) {
            countdownEl.textContent = 'TODAY!';
        } else {
            countdownEl.textContent = 'Married!';
        }
    }
    
    // Update budget summary
    function updateBudgetSummary(budget) {
        const totalEl = document.getElementById('totalBudget');
        const spentEl = document.getElementById('spentAmount');
        const progressEl = document.getElementById('budgetProgress');
        
        if (totalEl) totalEl.textContent = `₹${budget.total.toLocaleString()}`;
        if (spentEl) spentEl.textContent = `₹${budget.spent.toLocaleString()}`;
        
        if (progressEl && budget.total > 0) {
            const percentage = (budget.spent / budget.total) * 100;
            progressEl.style.width = `${Math.min(percentage, 100)}%`;
            
            if (percentage > 90) {
                progressEl.classList.remove('bg-primary');
                progressEl.classList.add('bg-danger');
            } else if (percentage > 70) {
                progressEl.classList.remove('bg-primary');
                progressEl.classList.add('bg-warning');
            }
        }
    }
    
    // Update guest summary
    function updateGuestSummary(guests) {
        const totalEl = document.getElementById('totalGuests');
        const confirmedEl = document.getElementById('confirmedGuests');
        const pendingEl = document.getElementById('pendingGuests');
        
        if (totalEl) totalEl.textContent = guests.total || 0;
        if (confirmedEl) confirmedEl.textContent = guests.confirmed || 0;
        if (pendingEl) pendingEl.textContent = guests.pending || 0;
    }
    
    // Update checklist summary
    function updateChecklistSummary(checklist) {
        const totalEl = document.getElementById('totalTasks');
        const completedEl = document.getElementById('completedTasks');
        const progressEl = document.getElementById('taskProgress');
        
        if (totalEl) totalEl.textContent = checklist.total || 0;
        if (completedEl) completedEl.textContent = checklist.completed || 0;
        
        if (progressEl && checklist.total > 0) {
            const percentage = (checklist.completed / checklist.total) * 100;
            progressEl.style.width = `${percentage}%`;
        }
    }
    
    // Set wedding date
    const setDateBtn = document.getElementById('setWeddingDate');
    if (setDateBtn) {
        setDateBtn.addEventListener('click', async function() {
            const dateInput = prompt('Enter your wedding date (YYYY-MM-DD):');
            if (dateInput) {
                const user = auth.currentUser;
                if (user && db) {
                    try {
                        await db.collection('weddings').doc(user.uid).update({
                            weddingDate: new Date(dateInput)
                        });
                        updateCountdown(new Date(dateInput));
                        alert('Wedding date set successfully!');
                    } catch (error) {
                        console.error('Error setting wedding date:', error);
                        alert('Error setting date. Please try again.');
                    }
                }
            }
        });
    }
    
    // Save budget
    const saveBudgetBtn = document.getElementById('saveBudget');
    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', async function() {
            const user = auth.currentUser;
            if (!user || !db) return;
            
            const totalBudget = parseFloat(document.getElementById('budgetTotal').value) || 0;
            
            try {
                await db.collection('weddings').doc(user.uid).update({
                    'budget.total': totalBudget,
                    'budget.updatedAt': firebase.firestore.FieldValue.serverTimestamp()
                });
                
                updateBudgetSummary({ total: totalBudget, spent: 0 });
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('budgetModal'));
                modal.hide();
                
                alert('Budget saved successfully!');
            } catch (error) {
                console.error('Error saving budget:', error);
                alert('Error saving budget. Please try again.');
            }
        });
    }
    
    // Add guest
    const addGuestBtn = document.getElementById('addGuest');
    if (addGuestBtn) {
        addGuestBtn.addEventListener('click', function() {
            const name = prompt('Guest name:');
            const email = prompt('Guest email (optional):');
            
            if (name) {
                addGuestToList(name, email || '');
            }
        });
    }
    
    // Add guest to list
    async function addGuestToList(name, email) {
        const user = auth.currentUser;
        if (!user || !db) return;
        
        try {
            const guestData = {
                name: name,
                email: email,
                status: 'pending',
                addedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const weddingRef = db.collection('weddings').doc(user.uid);
            await weddingRef.update({
                'guests.list': firebase.firestore.FieldValue.arrayUnion(guestData),
                'guests.total': firebase.firestore.FieldValue.increment(1),
                'guests.pending': firebase.firestore.FieldValue.increment(1)
            });
            
            // Reload guest data
            const doc = await weddingRef.get();
            if (doc.exists) {
                updateGuestSummary(doc.data().guests);
            }
            
            alert('Guest added successfully!');
        } catch (error) {
            console.error('Error adding guest:', error);
            alert('Error adding guest. Please try again.');
        }
    }
    
    console.log('✅ Planning tools initialized');
});

// Export function to check if user is on planning page
window.isPlanningPage = function() {
    return document.getElementById('planningDashboard') !== null;
};