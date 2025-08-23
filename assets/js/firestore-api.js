(function(){
  if(!window.firebase) return;
  const db = firebase.firestore();
  window.AppDB = {
    getBlogs: function(limit=10){ return db.collection('blogs').orderBy('created_at','desc').limit(limit).get(); },
    getVendors: function(){ return db.collection('vendors').where('status','==','approved').get(); },
    getPendingVendors: function(){ return db.collection('vendors').where('status','==','pending').get(); },
    addVendor: function(data){ return db.collection('vendors').add(data); },
    approveVendor: function(docId){ return db.collection('vendors').doc(docId).update({status:'approved', approved_at: firebase.firestore.FieldValue.serverTimestamp()}); },
    savePlanner: function(uid, data){ return db.collection('planners').doc(uid).set(data); },
    getPlanner: function(uid){ return db.collection('planners').doc(uid).get(); }
  };
})();