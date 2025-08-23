<?php
require 'parsedown.php';

$blog = $_GET['blog'] ?? '';
$blogDir = __DIR__ . "/blogs/$blog";
$mdFile = "$blogDir/blog.md";

if (!$blog || !file_exists($mdFile)) {
  die("Blog not found.");
}

$Parsedown = new Parsedown();
$content = $Parsedown->text(file_get_contents($mdFile));

// Find images
$images = glob("$blogDir/image*.*");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><?= ucfirst(str_replace("-", " ", $blog)) ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #fdfdfd; font-family: Georgia, serif; color: #333; }
    .blog-header { max-height: 400px; overflow: hidden; border-radius: 20px; margin-bottom: 2rem; }
    .blog-header img { width: 100%; object-fit: cover; }
    .blog-content { line-height: 1.8; font-size: 1.1rem; }
    .blog-content h1, .blog-content h2, .blog-content h3 { margin-top: 2rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
<div class="container py-5">
  <a href="index.php" class="btn btn-outline-secondary mb-4">← Back to Blogs</a>

  <?php if ($images): ?>
    <div class="blog-header">
      <img src="blogs/<?= $blog ?>/<?= basename($images[0]) ?>" alt="">
    </div>
  <?php endif; ?>

  <div class="blog-content">
    <?= $content ?>
  </div>

  <?php if (count($images) > 1): ?>
    <h3 class="mt-5">Gallery</h3>
    <div class="row g-3">
      <?php foreach (array_slice($images, 1) as $img): ?>
        <div class="col-md-4">
          <img src="blogs/<?= $blog ?>/<?= basename($img) ?>" class="img-fluid rounded shadow-sm" alt="">
        </div>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>
</div>
</body>
</html>
