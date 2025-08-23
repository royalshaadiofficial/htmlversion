<?php
require_once 'functions.php';
$page_title = 'Vendor Registration';
include 'header.php';
?>
<main class="container">
  <h1>Vendor Registration</h1>
  <div class="card" style="padding:1rem">
    <p>Please sign in with Google, then complete your vendor details. Your registration will be pending until admin approval.</p>
    <form id="vendorForm">
      <label>Business Name <input name="business_name" required></label><br>
      <label>Category <input name="category" required></label><br>
      <label>City <input name="city" required></label><br>
      <label>Contact Email <input name="contact_email" type="email" required></label><br>
      <label>Price Range (approx) <input name="price_range"></label><br>
      <button class="btn btn-primary" type="submit">Register</button>
    </form>
  </div>
</main>
<script>
document.getElementById('vendorForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!firebase.auth().currentUser){ alert('Please sign in first.'); return; }
  const uid = firebase.auth().currentUser.uid;
  const data = {
    uid, business_name: e.target.business_name.value, category: e.target.category.value, city: e.target.city.value,
    contact_email: e.target.contact_email.value, price_range: e.target.price_range.value, status: 'pending', created_at: firebase.firestore.FieldValue.serverTimestamp()
  };
  try{
    const res = await AppDB.addVendor(data);
    alert('Registration submitted and is pending approval.');
    window.location='vendors.php';
  }catch(err){ alert('Failed: '+err.message); }
});
</script>
<?php include 'footer.php'; ?>