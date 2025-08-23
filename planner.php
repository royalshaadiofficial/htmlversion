<?php
require_once 'functions.php';
$page_title = 'Wedding Planner';
include 'header.php';
?>
<main class="container">
  <h1>Wedding Planner</h1>
  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <h3>Budget Calculator (INR)</h3>
    <div id="budgetItems">
      <div class="budget-row"><input placeholder="Item" class="b-item"> <input placeholder="Amount" class="b-amount"></div>
    </div>
    <button id="addBudget" class="btn">Add item</button>
    <button id="calcBudget" class="btn btn-primary">Calculate Total</button>
    <div id="budgetTotal" style="margin-top:1rem;font-weight:700"></div>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <h3>Guest List</h3>
    <input id="guestName" placeholder="Guest name"> <button id="addGuest" class="btn">Add</button>
    <ul id="guestList"></ul>
  </div>

  <div class="card" style="padding:1rem;margin-bottom:1rem">
    <h3>Selected Vendors</h3>
    <ul id="selectedVendors"></ul>
  </div>

  <div>
    <button id="savePlanner" class="btn btn-primary">Save Planner (to Firestore)</button>
    <span id="saveStatus" style="margin-left:1rem"></span>
  </div>
</main>

<script>
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('addBudget').addEventListener('click', ()=>{
    const div = document.createElement('div'); div.className='budget-row'; div.innerHTML = '<input placeholder="Item" class="b-item"> <input placeholder="Amount" class="b-amount">';
    document.getElementById('budgetItems').appendChild(div);
  });
  document.getElementById('calcBudget').addEventListener('click', ()=>{
    const amounts = document.querySelectorAll('.b-amount');
    let total=0;
    amounts.forEach(a=>{ const v = parseFloat(a.value.replace(/,/g,'')) || 0; total += v; });
    document.getElementById('budgetTotal').textContent = 'Total: ₹' + total.toLocaleString('en-IN');
  });
  document.getElementById('addGuest').addEventListener('click', ()=>{
    const name = document.getElementById('guestName').value.trim();
    if(!name) return;
    const li = document.createElement('li'); li.textContent = name;
    document.getElementById('guestList').appendChild(li);
    document.getElementById('guestName').value='';
  });

  document.getElementById('savePlanner').addEventListener('click', async ()=>{
    if(!window.firebase || !firebase.auth().currentUser){ alert('Please sign in to save your planner.'); return; }
    const uid = firebase.auth().currentUser.uid;
    const budgetRows = document.querySelectorAll('.budget-row');
    const budget = [];
    budgetRows.forEach(r=>{ const item = r.querySelector('.b-item').value; const amount = parseFloat((r.querySelector('.b-amount').value||'').replace(/,/g,''))||0; if(item) budget.push({item,amount}); });
    const guests = Array.from(document.querySelectorAll('#guestList li')).map(li=>li.textContent);
    const vendors = Array.from(document.querySelectorAll('#selectedVendors li')).map(li=>li.textContent);
    const data = {budget,guests,vendors,updated_at: firebase.firestore.FieldValue.serverTimestamp()};
    try{
      await AppDB.savePlanner(uid, data);
      document.getElementById('saveStatus').textContent = 'Saved!';
    }catch(e){ console.error(e); alert('Save failed: '+e.message); }
  });

  const sv = JSON.parse(localStorage.getItem('selectedVendors')||'[]');
  sv.forEach(v=>{ const li=document.createElement('li'); li.textContent=v; document.getElementById('selectedVendors').appendChild(li); });
});
</script>

<?php include 'footer.php'; ?>