// (function(){
//   const cfg = window._FIREBASE_CONFIG || {};
//   if(!cfg || !cfg.apiKey) return;

//   if (!firebase.apps.length) {
//     firebase.initializeApp(cfg);
//   }
//   const auth = firebase.auth();

//   const signInBtn = document.getElementById('firebaseSignInBtn');
//   const userBadge = document.getElementById('userBadge');

//   function renderUser(user){
//     if(!user){
//       if(userBadge) userBadge.style.display='none';
//       if(signInBtn) signInBtn.style.display='inline-block';
//     } else {
//       if(signInBtn) signInBtn.style.display='none';
//       if(userBadge) { 
//         userBadge.style.display='inline-block'; 
//         userBadge.textContent = user.displayName || user.email; 
//       }
//     }
//   }

//   auth.onAuthStateChanged((user)=>{
//     renderUser(user);
//   });

//   if(signInBtn){
//     signInBtn.addEventListener('click', ()=>{
//       const provider = new firebase.auth.GoogleAuthProvider();
//       auth.signInWithPopup(provider).then(result=>{
//         const user = result.user;
//         renderUser(user);
//       }).catch(err=>{
//         console.error('Sign-in error', err);
//         alert('Sign in failed: '+err.message);
//       });
//     });
//   }
// })();
