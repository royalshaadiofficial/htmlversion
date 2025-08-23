<?php
require_once 'functions.php';
$page_title = 'Admin - Approve Vendors';
include 'header.php';
?>
<main class="container">
  <h1>Admin — Vendor Approvals</h1>
  <div id="adminNotice" class="card" style="padding:1rem;margin-bottom:1rem">You must be signed in with the admin Google account (advertexpanse@gmail.com) to view and approve vendors.</div>
  <div id="pendingList"></div>
</main>

<script>
async function loadPending(){
  const user = firebase.auth().currentUser;
  if(!user){ document.getElementById('pendingList').innerHTML='<p>Please sign in with the admin account.</p>'; return; }
  if(user.email !== window._ADMIN_EMAIL){ document.getElementById('pendingList').innerHTML='<p>Access denied. Signed-in user is not admin.</p>'; return; }
  const snap = await AppDB.getPendingVendors();
  const container = document.getElementById('pendingList'); container.innerHTML='';
  snap.forEach(doc=>{
    const d = doc.data(); const id = doc.id;
    const card = document.createElement('div'); card.className='card'; card.style.padding='1rem'; card.style.marginBottom='0.5rem';
    card.innerHTML = `<h4>${d.business_name||d.name}</h4><p>${d.category||''} — ${d.city||''}</p><button class="approve">Approve</button>`;
    card.querySelector('.approve').addEventListener('click', async ()=>{
      await AppDB.approveVendor(id);
      loadPending();
      alert('Vendor approved');
    });
    container.appendChild(card);
  });
}

firebase.auth().onAuthStateChanged(user=>{ if(user) loadPending(); else document.getElementById('pendingList').innerHTML=''; });
</script>

<?php include 'footer.php'; ?>
