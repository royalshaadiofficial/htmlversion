<?php
require_once 'functions.php';
$page_title = 'Blog - Royal Shaadi Weddings';
include 'header.php';
$posts = get_latest_posts(12);
?>
<main class="container">
  <h1>Magazine</h1>
  <div class="masonry">
    <?php foreach($posts as $p): ?>
    <article class="masonry-item card">
      <a href="single.php?id=<?php echo urlencode($p['id']); ?>">
        <img src="<?php echo htmlspecialchars($p['image']); ?>" alt="<?php echo htmlspecialchars($p['title']); ?>">
        <h3><?php echo htmlspecialchars($p['title']); ?></h3>
      </a>
      <p class="meta"><?php echo date('M j, Y', strtotime($p['created_at'])); ?></p>
    </article>
    <?php endforeach; ?>
  </div>
</main>
<?php include 'footer.php'; ?>