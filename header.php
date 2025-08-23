<?php
if (!isset($page_title)) $page_title = 'Royal Shaadi';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($page_title); ?></title>
  <meta name="description" content="Premium wedding, fashion and lifestyle magazine — curated editorial, vendor listings and planning resources.">
  <meta name="robots" content="index, follow">
  <!-- Open Graph -->
  <meta property="og:title" content="<?php echo htmlspecialchars($page_title); ?>">
  <meta property="og:description" content="Luxury wedding & lifestyle inspiration and vendor curation.">
  <meta property="og:type" content="website">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/styles.css">

  <!-- Firebase (compat) -->
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

  <script>
  // Embedded Firebase config
  window._FIREBASE_CONFIG = {"apiKey": "AIzaSyBBIk0WfONu9tcD63hYNjXnNViXKd5BFZU", "authDomain": "royal-shaadi.firebaseapp.com", "projectId": "royal-shaadi", "storageBucket": "royal-shaadi.firebasestorage.app", "messagingSenderId": "16207213661", "appId": "1:16207213661:web:4f942e1f5a981a72a649b4", "measurementId": "G-BGHXT644B8"};
  window._ADMIN_EMAIL = "advertexpanse@gmail.com";
  </script>

  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Royal Weddings & Lifestyle",
    "url": "https://www.royalshaadi.co.in/",
    "logo": "https://www.royalshaadi.co.in/assets/images/logo.png"
  }
  </script>
</head>
<body>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">Royal Shaadi<span class="accent">.</span></a>
    <nav class="main-nav" id="mainNav">
      <a href="/">Home</a>
      <a href="/blog.php">Blogs</a>
      <a href="/planner.php">Planner</a>
      <a href="/vendors.php">Vendors</a>
      <a href="/contact.php">Contact</a>
    </nav>
    <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
    <div class="auth-section">
      <button id="signInBtn" class="btn btn-outline-primary" style="display: inline-block;">Sign in</button>
      <button id="signOutBtn" class="btn btn-light" style="display: none;">Sign out</button>
      <div id="userBadge" class="user-badge nav-link" style="display:none"></div>
    </div>
  </div>
</header>

<script>
function updateUI(user) {
  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const userBadge = document.getElementById('userBadge');

  if (user) {
    signInBtn.style.display = 'none';
    signOutBtn.style.display = 'inline-block';
    userBadge.style.display = 'inline-block';
    const photoUrl = user.photoURL;
    console.log('Photo URL:', photoUrl); // Debug log
    userBadge.innerHTML = `<a href="/profile.php" title="Profile">
      <img src="${photoUrl || 'https://via.placeholder.com/30'}" alt="User Profile" class="rounded-circle" width="30" height="30" style="object-fit:cover;" onerror="this.src='https://via.placeholder.com/30';">
    </a>`;
  } else {
    signInBtn.style.display = 'inline-block';
    signOutBtn.style.display = 'none';
    userBadge.style.display = 'none';
    userBadge.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase
  try {
    firebase.initializeApp(window._FIREBASE_CONFIG);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    alert('Failed to initialize Firebase. Check console for details.');
    return;
  }
  const auth = firebase.auth();

  const signInBtn = document.getElementById('signInBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('mainNav');

  // Toggle navigation menu
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
  });

  // Sign-in handler
  signInBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      console.log('User data:', user); // Debug log
      // Set session for profile.php
      sessionStorage.setItem('user_id', user.uid); // Using sessionStorage for simplicity
      updateUI(user);
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Sign-in failed: ' + error.message);
    }
  });

  // Sign-out handler
  signOutBtn.addEventListener('click', async () => {
    try {
      await auth.signOut();
      sessionStorage.removeItem('user_id'); // Clear session
      updateUI(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign-out failed:', error);
      alert('Sign-out failed: ' + error.message);
    }
  });

  // Update UI based on auth state
  auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user); // Debug log
    updateUI(user);
  });
});
</script>