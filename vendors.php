<?php
require 'vendor/autoload.php';

use Kreait\Firebase\Factory;

// Initialize Firebase
$factory = (new Factory)->withServiceAccount(json_decode(getenv('FIREBASE_SERVICE_ACCOUNT'), true));
$firestore = $factory->createFirestore();
$db = $firestore->database();

$search = $_GET['search'] ?? '';
?>
<?php require 'header.php'; ?>
<section class="py-5">
  <div class="container">
    <h2 class="text-center mb-4">All Vendors</h2>
    <form method="GET" class="mb-4">
      <div class="input-group">
        <input type="text" name="search" class="form-control" placeholder="Search by business name..." value="<?php echo htmlspecialchars($search); ?>">
        <button type="submit" class="btn btn-primary">Search</button>
      </div>
    </form>
    <div class="row">
      <?php
      $query = $db->collection('vendors')->where('status', '=', 'approved');
      if ($search) {
        // Prefix search for business_name (Firestore doesn't support full-text, so use range query)
        $query = $query->where('business_name', '>=', $search)->where('business_name', '<=', $search . "\uf8ff");
      }
      $documents = $query->documents();
      foreach ($documents as $doc) {
        if ($doc->exists()) {
          $data = $doc->data();
          $name = $data['business_name'] ?? 'Unknown';
          $category = $data['category'] ?? 'Unknown';
          $city = $data['city'] ?? 'Unknown';
          $price = $data['price'] ?? 0;
          $description = $data['description'] ?? '';
          $image = $data['image'] ?? 'https://via.placeholder.com/1200x800'; // Placeholder if empty
          $id = $doc->id();
          echo "
            <div class='col-md-4 mb-4' id='{$id}'>
              <div class='premium-card'>
                <img src='{$image}' alt='{$name}' loading='lazy' />
                <div class='card-body'>
                  <h5>{$name}</h5>
                  <div class='mb-1'><span class='tag'>{$category}</span></div>
                  <p class='meta'>{$city} - ₹" . number_format($price) . "</p>
                  <p>{$description}</p>
                  <a href='https://www.royalshaadi.co.in/contact.php?vendor={$id}' class='btn btn-sm btn-outline-primary'>Contact</a>
                </div>
              </div>
            </div>
          ";
        }
      }
      if ($documents->isEmpty()) {
        echo "<p class='text-center'>No vendors found.</p>";
      }
      ?>
    </div>
  </div>
</section>
<?php require 'footer.php'; ?>