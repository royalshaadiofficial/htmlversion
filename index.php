<?php
require 'Parsedown.php';
require 'functions.php';

use Kreait\Firebase\Factory;
if (file_exists('vendor/autoload.php')) {
  require 'vendor/autoload.php';

  // Initialize Firebase
  $serviceAccountPath = __DIR__ . '/firebase-service-account.json';
  $factory = (new Factory)->withServiceAccount($serviceAccountPath);
  $firestore = $factory->createFirestore();
  $db = $firestore->database();
} else {
  die('Please run "composer install" to install dependencies.');
}

function parse_yaml_front_matter($content) {
  $result = ['content' => $content];
  if (preg_match('/^---\s*\n([\s\S]*?)\n---\s*\n(.*)$/s', $content, $matches)) {
    $yaml = $matches[1];
    $result['content'] = $matches[2];
    $lines = explode("\n", $yaml);
    foreach ($lines as $line) {
      if (preg_match('/^(\w+):\s*(.+)$/', $line, $line_matches)) {
        $result[$line_matches[1]] = trim($line_matches[2]);
      }
    }
  }
  return $result;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Royal Shaadi — Premium Weddings & Lifestyle</title>
  <meta name="description" content="Royal Shaadi — premium wedding planning, vendors, inspiration and tools." />

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />

  <!-- Swiper CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    .premium-card {
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 6px 18px rgba(10,10,10,0.06);
      transition: transform .28s ease, box-shadow .28s ease;
    }
    .premium-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
    .premium-card .card-body {
      padding: 1rem;
    }
    .premium-card h5 {
      font-family: 'Playfair Display', serif;
      font-weight: 600;
      margin-bottom: .35rem;
    }
    .premium-card .tag {
      background: rgba(183,138,88,0.08);
      color: #b88458;
      padding: 4px 8px;
      border-radius: 999px;
      font-weight: 600;
      font-size: .85rem;
    }
    .premium-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 40px rgba(10,10,10,0.12);
    }
    .hero {
      background-image: url('assets/images/hero.jpg');
      background-size: cover;
      background-position: center;
      min-height: 65vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-shadow: 0 6px 30px rgba(0,0,0,0.35);
      text-align: center;
    }
    .swiper {
      padding: 10px 0 30px;
    }
    .swiper-button-next, .swiper-button-prev {
      color: #333;
    }
    #blogGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      padding-top: 1.5rem;
    }
    .premium-card .btn {
      border-radius: 50px;
      font-size: .9rem;
      padding: 6px 16px;
    }
    .hero h1 {
      text-shadow: 0 4px 18px rgba(0,0,0,0.45);
    }
    .hero p {
      color: #f8f9fa;
      font-size: 1.1rem;
    }
  </style>

  <script>
    window._FIREBASE_CONFIG = {
      apiKey: "<?php echo getenv('FIREBASE_API_KEY'); ?>",
      authDomain: "<?php echo getenv('FIREBASE_AUTH_DOMAIN'); ?>",
      projectId: "<?php echo getenv('FIREBASE_PROJECT_ID'); ?>",
      storageBucket: "<?php echo getenv('FIREBASE_STORAGE_BUCKET'); ?>",
      messagingSenderId: "<?php echo getenv('FIREBASE_MESSAGING_SENDER_ID'); ?>",
      appId: "<?php echo getenv('FIREBASE_APP_ID'); ?>",
      measurementId: "<?php echo getenv('FIREBASE_MEASUREMENT_ID'); ?>"
    };
  </script>
</head>
<body>
<?php require 'header.php'; ?>

  <!-- Hero Section -->
  <header class="hero">
    <div class="container">
      <h1 class="display-4 fw-bold">Plan your dream wedding — the royal way</h1>
      <p class="lead text-muted mb-4">Premium vendors, curated editorial, and powerful planning tools.</p>
      <a href="/wedding_planner.php" class="btn btn-lg btn-primary">Start Planning</a>
    </div>
  </header>

  <!-- Featured Vendors (Swiper Carousel) -->
  <section class="py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Featured Vendors</h2>
        <div class="carousel-cta small">Handpicked & Verified</div>
      </div>
      <div class="swiper vendor-swiper">
        <div class="swiper-wrapper" id="vendorSlides">
          <?php
          if (isset($db)) {
            $query = $db->collection('vendors')->where('status', '=', 'approved')->limit(6);
            $documents = $query->documents();
            foreach ($documents as $doc) {
              if ($doc->exists()) {
                $data = $doc->data();
                $name = $data['business_name'] ?? 'Unknown';
                $category = $data['category'] ?? 'Unknown';
                $city = $data['city'] ?? 'Unknown';
                $price = $data['price'] ?? 0;
                $image = $data['image'] ?? 'https://via.placeholder.com/1200x800'; // Placeholder if empty
                $url = "/vendors.php#" . urlencode(strtolower($name));
                echo "
                  <div class='swiper-slide'>
                    <article class='premium-card vendor-card'>
                      <img src='{$image}' alt='{$name}' loading='lazy' />
                      <div class='card-body'>
                        <h5>{$name}</h5>
                        <div class='mb-1'><span class='tag'>{$category}</span></div>
                        <p class='meta'>{$city}</p>
                        <div class='d-flex justify-content-between align-items-center'>
                          <small class='text-muted'>₹" . number_format($price) . "</small>
                          <a href='{$url}' class='btn btn-sm btn-outline-primary'>View</a>
                        </div>
                      </div>
                    </article>
                  </div>
                ";
              }
            }
          } else {
            echo "<p>Firebase database not initialized. Please check your configuration.</p>";
          }
          ?>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>

  <!-- Latest Blogs Grid -->
  <section id="blogs" class="py-5 bg-light">
    <div class="container">
      <h2 class="text-center mb-4">Latest Blogs</h2>
      <div id="blogGrid">
        <?php
        $blogDir = __DIR__ . '/blogs';
        if (is_dir($blogDir)) {
          $blogs = array_filter(glob($blogDir . '/*'), 'is_dir');
          usort($blogs, fn($a, $b) => filemtime($b) <=> filemtime($a));
          $blogs = array_slice($blogs, 0, 6);
          foreach ($blogs as $blog) {
            $blogName = basename($blog);
            $blogIndex = $blog . '/blog.md';
            $blogUrl = "/single-blog.php?blog=" . urlencode(str_replace(' ', '-', $blogName));

            $images = glob($blog . '/image*.{jpg,png,gif}', GLOB_BRACE);
            $imgUrl = count($images) > 0 ? '/blogs/' . $blogName . '/' . basename($images[0]) : 'https://via.placeholder.com/1200x800';

            $excerpt = '';
            if (file_exists($blogIndex)) {
              $content = strip_tags(file_get_contents($blogIndex));
              $words = explode(' ', $content);
              $excerpt = implode(' ', array_slice($words, 0, 30)) . '...';
            }
        ?>
          <article class="premium-card blog-card">
            <img src="<?= htmlspecialchars($imgUrl) ?>" alt="<?= htmlspecialchars($blogName) ?>" loading="lazy" />
            <div class="card-body">
              <h5><?= htmlspecialchars(ucwords(str_replace('-', ' ', $blogName))) ?></h5>
              <div class="mb-1"><span class="tag">Wedding</span></div>
              <p class="meta"><?= htmlspecialchars($excerpt) ?></p>
              <a href="<?= htmlspecialchars($blogUrl) ?>" class="btn btn-sm btn-outline-primary">Read More</a>
            </div>
          </article>
        <?php
          }
        }
        ?>
      </div>
    </div>
  </section>

  <!-- Role Selection Modal -->
  <div class="modal fade" id="roleModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <form id="roleForm">
          <div class="modal-header">
            <h5 class="modal-title">Welcome — choose your account type</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you signing in as a <strong>User</strong> or a <strong>Vendor</strong>?</p>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="role" id="roleUser" value="User" checked />
              <label class="form-check-label" for="roleUser">User</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="role" id="roleVendor" value="Vendor" />
              <label class="form-check-label" for="roleVendor">Vendor</label>
            </div>
            <small class="form-text text-muted">You can change this later from your profile.</small>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Continue</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Firebase Compat Libraries -->
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

  <!-- Swiper JS -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

  <!-- Bootstrap Bundle JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <script>
    // Initialize Firebase
    firebase.initializeApp(window._FIREBASE_CONFIG);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // UI Elements
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const navProfileLink = document.getElementById('navProfileLink');
    const navSigninBtn = document.getElementById('navSigninBtn');
    const navSignoutBtn = document.getElementById('navSignoutBtn');

    const roleModalEl = document.getElementById('roleModal');
    const roleModal = new bootstrap.Modal(roleModalEl, { backdrop: 'static', keyboard: false });
    const roleForm = document.getElementById('roleForm');

    // Show/hide UI helpers
    function updateProfileUI(user) {
      const profileLink = document.getElementById('profileLink');
      const userBadge = document.getElementById('userBadge');
      const navProfileLink = document.getElementById('navProfileLink');
      const signInBtn = document.getElementById('signInBtn');
      const signOutBtn = document.getElementById('signOutBtn');
      const navSigninBtn = document.getElementById('navSigninBtn');
      const navSignoutBtn = document.getElementById('navSignoutBtn');

      if (user) {
        navProfileLink.style.display = 'block';
        navSigninBtn.style.display = 'none';
        navSignoutBtn.style.display = 'block';
        let badgeHtml = '';
        if (user.photoURL) {
          badgeHtml = `<img src="${user.photoURL}" alt="Profile" class="rounded-circle" width="30" height="30" style="object-fit:cover;">`;
        } else {
          const color = getRandomColor();
          const initial = getInitial(user.displayName || user.email);
          badgeHtml = `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:${color};color:#333;font-weight:bold;font-size:16px;">${initial}</span>`;
        }
        userBadge.innerHTML = badgeHtml;
        navProfileLink.href = '/profile.php';
      } else {
        navProfileLink.style.display = 'none';
        navSigninBtn.style.display = 'block';
        navSignoutBtn.style.display = 'none';
        userBadge.innerHTML = '';
      }
    }

    function getRandomColor() {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 80%)`;
    }

    function getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : '';
    }

    // Sign-in handler
    document.addEventListener('signInClick', async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        roleModal.show();

        roleForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const role = document.querySelector('input[name="role"]:checked').value || 'User';

          await db.collection('users').doc(user.uid).set({
            name: user.displayName || '',
            email: user.email || '',
            photo: user.photoURL || '',
            role: role,
            subscribed: false,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          localStorage.setItem('rs_role', role);

          roleModal.hide();
          updateProfileUI(user);
          session_start();
          $_SESSION['user_id'] = $user->uid; // Set session for profile access
        }, { once: true });
      } catch (error) {
        console.error('Sign-in failed', error);
        alert('Sign in failed: ' + (error.message || error));
      }
    });

    // Sign-out handler
    document.addEventListener('signOutClick', async () => {
      await auth.signOut();
      updateProfileUI(null);
      session_destroy(); // Destroy session on sign-out
      window.location = '/';
    });

    // Listen to auth state changes
    auth.onAuthStateChanged((user) => {
      updateProfileUI(user);
    });

    // Load vendors into Swiper carousel
    function loadVendors() {
      const container = document.getElementById('vendorSlides');
      if (container) {
        let html = '';
        if (typeof $db !== 'undefined' && $db) { // Check if PHP $db is passed or use Firebase JS db
          const query = $db.collection('vendors').where('status', '=', 'approved').limit(6);
          query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const name = data.business_name || 'Unknown';
              const category = data.category || 'Unknown';
              const city = data.city || 'Unknown';
              const price = data.price || 0;
              const image = data.image || 'https://via.placeholder.com/1200x800';
              const url = "/vendors.php#" + encodeURIComponent(name.toLowerCase());
              html += `
                <div class="swiper-slide">
                  <article class="premium-card vendor-card">
                    <img src="${image}" alt="${escapeHtml(name)}" loading="lazy" />
                    <div class="card-body">
                      <h5>${escapeHtml(name)}</h5>
                      <div class="mb-1"><span class="tag">${escapeHtml(category)}</span></div>
                      <p class="meta">${escapeHtml(city)}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">₹${numberFormat(price)}</small>
                        <a href="${escapeHtml(url)}" class="btn btn-sm btn-outline-primary">View</a>
                      </div>
                    </div>
                  </article>
                </div>
              `;
            });
            container.innerHTML = html;
            if (window.vendorSwiper) window.vendorSwiper.destroy(true, true);
            window.vendorSwiper = new Swiper('.vendor-swiper', {
              slidesPerView: 1,
              spaceBetween: 18,
              navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
              pagination: { el: '.swiper-pagination', clickable: true },
              breakpoints: { 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 992: { slidesPerView: 3 } }
            });
          }).catch((error) => {
            console.error('Error loading vendors:', error);
            container.innerHTML = '<p>Error loading vendors. Check Firebase configuration.</p>';
          });
        } else {
          console.warn('Firebase database not available in client-side script.');
        }
      }
    }

    // Load blogs into grid
    function loadBlogs() {
      const container = document.getElementById('blogGrid');
      if (container) {
        const blogDir = 'blogs';
        let html = '';
        const blogs = <?php
          $blogDir = __DIR__ . '/blogs';
          $blogs = is_dir($blogDir) ? array_filter(glob($blogDir . '/*'), 'is_dir') : [];
          usort($blogs, fn($a, $b) => filemtime($b) <=> filemtime($a));
          $blogs = array_slice($blogs, 0, 6);
          $blogData = [];
          foreach ($blogs as $blog) {
            $blogName = basename($blog);
            $blogIndex = $blog . '/blog.md';
            $images = glob($blog . '/image*.{jpg,png,gif}', GLOB_BRACE);
            $imgUrl = count($images) > 0 ? '/blogs/' . $blogName . '/' . basename($images[0]) : 'https://via.placeholder.com/1200x800';
            $excerpt = '';
            if (file_exists($blogIndex)) {
              $content = strip_tags(file_get_contents($blogIndex));
              $words = explode(' ', $content);
              $excerpt = implode(' ', array_slice($words, 0, 30)) . '...';
            }
            $blogData[] = [
              'title' => ucwords(str_replace('-', ' ', $blogName)),
              'category' => 'Wedding',
              'excerpt' => $excerpt,
              'image' => $imgUrl,
              'url' => "/single-blog.php?blog=" . urlencode(str_replace(' ', '-', $blogName))
            ];
          }
          echo json_encode($blogData);
        ?>;
        blogs.forEach(b => {
          html += `
            <article class="premium-card blog-card">
              <img src="${escapeHtml(b.image)}" alt="${escapeHtml(b.title)}" loading="lazy" />
              <div class="card-body">
                <h5>${escapeHtml(b.title)}</h5>
                <div class="mb-1"><span class="tag">${escapeHtml(b.category)}</span></div>
                <p class="meta">${escapeHtml(b.excerpt)}</p>
                <a href="${escapeHtml(b.url)}" class="btn btn-sm btn-outline-primary">Read More</a>
              </div>
            </article>
          `;
        });
        container.innerHTML = html;
      }
    }

    // Simple helper to escape HTML
    function escapeHtml(str) {
      return str ? str.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m]) : '';
    }

    // Initialize everything after DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      loadVendors();
      loadBlogs();
    });
  </script>

  <?php require 'footer.php'; ?>
</body>
</html>