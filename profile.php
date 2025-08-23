<?php
// profile.php
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Profile — Royal Shaadi</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    .profile-card { border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.06); overflow: hidden; }
    .profile-photo { width: 140px; height: 140px; object-fit: cover; border-radius: 50%; }
    .vendor-form .form-control { border-radius: 8px; }
    .small-muted { color: #6b7280; }
    .vendor-list .card { margin-bottom: 1rem; }
    .edit-btn, .delete-btn { margin-right: 0.5rem; }
    .status-approved { color: green; font-weight: bold; }
    .status-pending { color: orange; font-weight: bold; }
  </style>
</head>
<body>
  <nav class="navbar navbar-light bg-white shadow-sm">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">Royal Shaadi</a>
      <div>
        <a class="btn btn-link" href="index.php">Home</a>
        <button id="signOutBtnTop" class="btn btn-outline-secondary">Sign out</button>
      </div>
    </div>
  </nav>

  <main class="container py-5">
    <div id="notSigned" class="text-center" style="display: none;">
      <p class="lead">You are not signed in.</p>
      <a href="index.php" class="btn btn-primary">Sign in</a>
    </div>

    <div id="profileArea" style="display: none;">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card profile-card p-4 text-center">
            <img id="profilePhoto" src="assets/images/profile_placeholder.jpg" class="profile-photo mb-3" alt="Profile">
            <h4 id="profileName"></h4>
            <p id="profileEmail" class="small-muted"></p>
            <p><strong>Role:</strong> <span id="profileRole"></span></p>
            <button id="changeRoleBtn" class="btn btn-outline-primary mt-2">Switch to Vendor</button>
            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" id="subscribeToggle">
              <label class="form-check-label small-muted" for="subscribeToggle">Subscribe to newsletter</label>
            </div>
            <div id="subscribeMsg" class="small text-success mt-2" style="display: none;">Updated</div>
          </div>
        </div>

        <div class="col-md-8">
          <!-- For Users: show saved vendors & quick planner shortcuts -->
          <div id="userSection" style="display: none;">
            <div class="card p-4 mb-4">
              <h5>Saved Vendors</h5>
              <p class="small-muted">Your shortlisted vendors will appear here (uses localStorage for demo).</p>
              <ul id="savedVendorsList" class="list-group list-group-flush"></ul>
            </div>

            <div class="card p-4 mb-4">
              <h5>Your Planner</h5>
              <p class="small-muted">Open the wedding planner to manage budget, guest list and more.</p>
              <a href="wedding_planner.php" class="btn btn-primary">Open Planner</a>
            </div>
          </div>

          <!-- For Vendors: registration + edit + list all services -->
          <div id="vendorSection" style="display: none;">
            <div class="card p-4 mb-4">
              <h5>Register / Edit Your Vendor Listing</h5>
              <form id="vendorForm" class="vendor-form">
                <input type="hidden" name="vendorId" id="vendorId">
                <div class="mb-3">
                  <label class="form-label">Business Name</label>
                  <input name="business_name" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Category</label>
                  <input name="category" class="form-control" placeholder="Photography, Venue, Catering..." required>
                </div>
                <div class="mb-3">
                  <label class="form-label">City / Location</label>
                  <input name="city" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Contact Email</label>
                  <input name="contact_email" type="email" class="form-control" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Price (approx)</label>
                  <input name="price" class="form-control" placeholder="e.g. 50000">
                </div>
                <div class="mb-3">
                  <label class="form-label">Image URL</label>
                  <input name="image" class="form-control" placeholder="https://... (you can upload to Firebase Storage later)">
                </div>
                <div class="mb-3">
                  <label class="form-label">Short Description</label>
                  <textarea name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" type="submit">Submit / Update</button>
                  <button id="deleteVendorBtn" type="button" class="btn btn-outline-danger" style="display: none;">Delete Listing</button>
                </div>
                <div id="vendorMsg" class="small text-success mt-2" style="display: none;">Saved — pending admin approval.</div>
              </form>
            </div>
            <div class="card p-4 mb-4">
              <h5>Your Vendor Services</h5>
              <p class="small-muted">All services listed under your email address.</p>
              <div id="vendorList" class="vendor-list"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

  <script>
    // config
    const firebaseConfig = {
      apiKey: "AIzaSyBBIk0WfONu9tcD63hYNjXnNViXKd5BFZU",
      authDomain: "royal-shaadi.firebaseapp.com",
      projectId: "royal-shaadi",
      storageBucket: "royal-shaadi.firebasestorage.app",
      messagingSenderId: "16207213661",
      appId: "1:16207213661:web:4f942e1f5a981a72a649b4",
      measurementId: "G-BGHXT644B8"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // UI refs
    const notSigned = document.getElementById('notSigned');
    const profileArea = document.getElementById('profileArea');
    const profilePhoto = document.getElementById('profilePhoto');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const changeRoleBtn = document.getElementById('changeRoleBtn');
    const subscribeToggle = document.getElementById('subscribeToggle');
    const subscribeMsg = document.getElementById('subscribeMsg');
    const userSection = document.getElementById('userSection');
    const vendorSection = document.getElementById('vendorSection');
    const savedVendorsList = document.getElementById('savedVendorsList');
    const vendorForm = document.getElementById('vendorForm');
    const vendorMsg = document.getElementById('vendorMsg');
    const deleteVendorBtn = document.getElementById('deleteVendorBtn');
    const vendorList = document.getElementById('vendorList');
    const signOutBtnTop = document.getElementById('signOutBtnTop');

    // helper escape
    function escapeHtml(s) { return String(s || ''); }

    function showNotSigned() { notSigned.style.display = 'block'; profileArea.style.display = 'none'; }
    function showProfile() { notSigned.style.display = 'none'; profileArea.style.display = 'block'; }

    function updateUI(user) {
      if (!user) {
        showNotSigned();
        signOutBtnTop.style.display = 'none';
        return;
      }
      showProfile();
      signOutBtnTop.style.display = 'inline-block';
      profilePhoto.src = user.photoURL || 'assets/images/profile_placeholder.jpg';
      profileName.textContent = user.displayName || '';
      profileEmail.textContent = user.email || '';
      fetchUserData(user.uid);
    }

    async function fetchUserData(uid) {
      const uref = db.collection('users').doc(uid);
      const ud = await uref.get();
      let docData = ud.exists ? ud.data() : null;
      if (!docData) {
        const role = localStorage.getItem('rs_role') || 'User';
        await uref.set({
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          photo: auth.currentUser.photoURL || '',
          role,
          subscribed: false,
          created_at: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        docData = { role, subscribed: false };
      }
      profileRole.textContent = docData.role || 'User';
      subscribeToggle.checked = !!docData.subscribed;
      changeRoleBtn.style.display = (docData.role === 'User') ? 'inline-block' : 'none';
      handleRole(docData.role);
    }

    function handleRole(role) {
      if (role === 'Vendor') {
        vendorSection.style.display = 'block';
        userSection.style.display = 'none';
        fetchVendorServices();
        vendorForm.contact_email.value = auth.currentUser.email || '';
      } else {
        vendorSection.style.display = 'none';
        userSection.style.display = 'block';
        const saved = JSON.parse(localStorage.getItem('selectedVendors') || '[]');
        savedVendorsList.innerHTML = saved.length ? saved.map(s => `<li class="list-group-item">${escapeHtml(s)}</li>`).join('') : '<li class="list-group-item small-muted">No saved vendors yet.</li>';
      }
    }

    async function fetchVendorServices() {
      const snapshot = await db.collection('vendors').where('contact_email', '==', auth.currentUser.email).get();
      vendorList.innerHTML = '';
      snapshot.forEach(vdoc => {
        const v = vdoc.data();
        const status = v.status || 'pending';
        const statusClass = status === 'approved' ? 'status-approved' : 'status-pending';
        const vendorCard = document.createElement('div');
        vendorCard.className = 'card mb-3 vendor-service';
        vendorCard.innerHTML = `
          <div class="card-body">
            <h6>${escapeHtml(v.business_name)}</h6>
            <p>Category: ${escapeHtml(v.category)}</p>
            <p>City: ${escapeHtml(v.city)}</p>
            <p>Contact: ${escapeHtml(v.contact_email)}</p>
            <p>Price: ₹${v.price || 0}</p>
            <p>Image: <img src="${escapeHtml(v.image) || 'https://via.placeholder.com/100'}" width="100"></p>
            <p>Description: ${escapeHtml(v.description)}</p>
            <p class="${statusClass}">Status: ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
            <button class="btn btn-sm btn-outline-primary edit-vendor" data-id="${vdoc.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-vendor" data-id="${vdoc.id}">Delete</button>
          </div>
        `;
        vendorList.appendChild(vendorCard);
      });
    }

    // Authentication state
    auth.onAuthStateChanged(user => {
      console.log('Auth state changed:', user);
      updateUI(user);
    });

    // Sign out
    signOutBtnTop.addEventListener('click', () => auth.signOut());
    document.getElementById('signOutBtn')?.addEventListener('click', () => auth.signOut());

    // Subscribe toggle
    subscribeToggle.onchange = async () => {
      if (!auth.currentUser) return;
      try {
        await db.collection('users').doc(auth.currentUser.uid).set({ subscribed: subscribeToggle.checked }, { merge: true });
        subscribeMsg.style.display = 'block';
        setTimeout(() => subscribeMsg.style.display = 'none', 2200);
      } catch (e) { console.error(e); alert('Could not update subscription'); }
    };

    // Change role
    changeRoleBtn.addEventListener('click', async () => {
      if (confirm('Switch to Vendor role? This will allow you to add vendor services. You can switch back later.')) {
        try {
          await db.collection('users').doc(auth.currentUser.uid).set({ role: 'Vendor' }, { merge: true });
          alert('Role switched to Vendor. Please refresh the page.');
          // Optionally reload to update UI
          // location.reload();
        } catch (e) { console.error(e); alert('Failed to switch role'); }
      }
    });

    // Vendor form submit
    vendorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!auth.currentUser) { alert('Please sign in'); return; }
      const uid = auth.currentUser.uid;
      const data = {
        uid,
        business_name: vendorForm.business_name.value.trim(),
        category: vendorForm.category.value.trim(),
        city: vendorForm.city.value.trim(),
        contact_email: vendorForm.contact_email.value.trim(),
        price: vendorForm.price.value ? Number(vendorForm.price.value) : 0,
        image: vendorForm.image.value.trim() || '',
        description: vendorForm.description.value.trim(),
        status: 'pending',
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      };
      try {
        let vendorId;
        if (vendorForm.dataset.vendorId) {
          vendorId = vendorForm.dataset.vendorId;
          await db.collection('vendors').doc(vendorId).set(data, { merge: true });
        } else {
          const vref = await db.collection('vendors').add(data);
          vendorId = vref.id;
        }
        vendorMsg.style.display = 'block';
        setTimeout(() => vendorMsg.style.display = 'none', 3000);
        vendorForm.reset();
        vendorForm.contact_email.value = auth.currentUser.email || '';
        delete vendorForm.dataset.vendorId;
        deleteVendorBtn.style.display = 'none';
        fetchVendorServices();
      } catch (e) { console.error(e); alert('Save failed'); }
    });

    // Delete vendor
    deleteVendorBtn.addEventListener('click', async () => {
      if (!vendorForm.dataset.vendorId) return;
      if (!confirm('Delete your vendor listing? This cannot be undone.')) return;
      try {
        await db.collection('vendors').doc(vendorForm.dataset.vendorId).delete();
        vendorForm.reset();
        delete vendorForm.dataset.vendorId;
        deleteVendorBtn.style.display = 'none';
        alert('Deleted');
        fetchVendorServices();
      } catch (e) { console.error(e); alert('Delete failed'); }
    });

    // Edit/Delete vendor (delegation)
    vendorSection.addEventListener('click', async (e) => {
      if (e.target.classList.contains('edit-vendor')) {
        const vendorId = e.target.dataset.id;
        const vdoc = await db.collection('vendors').doc(vendorId).get();
        if (vdoc.exists) {
          const v = vdoc.data();
          vendorForm.business_name.value = v.business_name || '';
          vendorForm.category.value = v.category || '';
          vendorForm.city.value = v.city || '';
          vendorForm.contact_email.value = v.contact_email || '';
          vendorForm.price.value = v.price || '';
          vendorForm.image.value = v.image || '';
          vendorForm.description.value = v.description || '';
          vendorForm.dataset.vendorId = vendorId;
          deleteVendorBtn.style.display = 'inline-block';
          vendorForm.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.target.classList.contains('delete-vendor')) {
        const vendorId = e.target.dataset.id;
        if (confirm('Delete this vendor service? This cannot be undone.')) {
          try {
            await db.collection('vendors').doc(vendorId).delete();
            e.target.closest('.vendor-service').remove();
            alert('Deleted');
          } catch (e) {
            console.error(e);
            alert('Delete failed');
          }
        }
      }
    });
  </script>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>