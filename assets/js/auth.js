// assets/js/auth.js
(function(){
  if(!window.firebase) {
    console.error('Firebase not loaded');
    return;
  }
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Elements (index.php)
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const navProfileLink = document.getElementById('navProfileLink');
  const navSigninBtn = document.getElementById('navSigninBtn');
  const navSignoutBtn = document.getElementById('navSignoutBtn');
  const roleModalEl = document.getElementById('roleModal');
  let roleModal;
  if(roleModalEl) roleModal = new bootstrap.Modal(roleModalEl, {backdrop:'static', keyboard:false});
  const roleForm = document.getElementById('roleForm');

  // Newsletter form on index
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMsg = document.getElementById('newsletterMsg');
  const newsletterError = document.getElementById('newsletterError');

  // Helper to show/hide UI
  function showSignedInUI(user) {
    if(navProfileLink) navProfileLink.style.display = 'block';
    if(navSigninBtn) navSigninBtn.style.display = 'none';
    if(navSignoutBtn) navSignoutBtn.style.display = 'block';
  }
  function showSignedOutUI() {
    if(navProfileLink) navProfileLink.style.display = 'none';
    if(navSigninBtn) navSigninBtn.style.display = 'block';
    if(navSignoutBtn) navSignoutBtn.style.display = 'none';
  }

  // Sign in flow
  if(signInBtn) signInBtn.addEventListener('click', async ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      // Show role modal to choose User or Vendor
      if(roleModal) roleModal.show();
      // Wait form submit to persist role & user doc
      roleForm && roleForm.addEventListener('submit', async (ev)=>{
        ev.preventDefault();
        const role = (document.querySelector('input[name="role"]:checked') || {}).value || 'User';
        try {
          await db.collection('users').doc(user.uid).set({
            name: user.displayName || '',
            email: user.email || '',
            photo: user.photoURL || '',
            role: role,
            subscribed: false,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          }, {merge:true});
          roleModal.hide();
          showSignedInUI(user);
          localStorage.setItem('rs_role', role);
        } catch(err){ console.error('Save user failed', err); }
      }, {once:true});
    } catch(err){
      console.error('Sign in error', err);
      alert('Sign-in failed: '+(err.message||err));
    }
  });

  // Sign out
  const signOutBtnEl = document.getElementById('signOut');
  function signOutAll(){
    auth.signOut().then(()=>{
      showSignedOutUI();
      // optionally clear local stored role
      localStorage.removeItem('rs_role');
      window.location = 'index.php';
    });
  }
  if(document.getElementById('signOutBtn')) document.getElementById('signOutBtn').addEventListener('click', signOutAll);
  if(signOutBtnEl) signOutBtnEl.addEventListener('click', signOutAll);

  // Newsletter subscription (saves to Firestore collection 'subscriptions')
  if(newsletterForm){
    newsletterForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value.trim();
      newsletterMsg.style.display='none';
      newsletterError.style.display='none';
      if(!email || !/^\S+@\S+\.\S+$/.test(email)){ newsletterError.textContent = 'Please enter a valid email.'; newsletterError.style.display='block'; return; }
      try {
        await db.collection('subscriptions').add({
          email: email,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        newsletterMsg.style.display='block';
        newsletterForm.reset();
      } catch(err){
        console.error(err);
        newsletterError.textContent = 'Subscription failed. Please try later.';
        newsletterError.style.display='block';
      }
    });
  }

  // auth state listener to reflect UI
  auth.onAuthStateChanged(async (user)=>{
    if(user){
      showSignedInUI(user);
      // Ensure user doc exists; if role is in localStorage keep it, otherwise read user doc
      const doc = await db.collection('users').doc(user.uid).get();
      if(!doc.exists){
        // if role in localStorage, write; otherwise prompt role modal
        const existingRole = localStorage.getItem('rs_role') || 'User';
        await db.collection('users').doc(user.uid).set({
          name: user.displayName || '',
          email: user.email || '',
          photo: user.photoURL || '',
          role: existingRole,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge:true});
      }
      // show profile link
      const prof = document.getElementById('navProfileLink');
      if(prof) prof.style.display = 'block';
    } else {
      showSignedOutUI();
    }
  });

  // Profile page population & subscribe toggle
  if(window.location.pathname.endsWith('profile.php') || window.location.pathname.endsWith('/profile.php')){
    auth.onAuthStateChanged(async (user)=>{
      const card = document.getElementById('profileCard');
      const notSigned = document.getElementById('notSigned');
      if(!user){
        if(card) card.style.display = 'none';
        if(notSigned) notSigned.style.display = 'block';
        return;
      }
      if(card) card.style.display = 'block';
      if(notSigned) notSigned.style.display = 'none';

      // populate fields
      document.getElementById('profilePhoto').src = user.photoURL || 'assets/images/profile_placeholder.jpg';
      document.getElementById('profileName').textContent = user.displayName || '';
      document.getElementById('profileEmail').textContent = user.email || '';

      // read role & subscription from firestore
      const udoc = await db.collection('users').doc(user.uid).get();
      const udata = udoc.exists ? udoc.data() : {};
      document.getElementById('profileRole').textContent = udata.role || (localStorage.getItem('rs_role')||'User');
      const subscribed = !!udata.subscribed;
      const toggle = document.getElementById('subscribeToggle');
      toggle.checked = subscribed;
      toggle.addEventListener('change', async ()=>{
        try {
          await db.collection('users').doc(user.uid).set({subscribed: toggle.checked}, {merge:true});
          const m = document.getElementById('subscribeMsg'); m.style.display = 'block';
          setTimeout(()=>m.style.display='none', 2500);
        } catch(err){ console.error(err); alert('Update failed'); }
      });
    });
  }

})();
