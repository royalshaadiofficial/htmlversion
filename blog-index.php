<!-- <?php
$blogs = [
  [
    "title" => "Top Wedding Trends of 2025",
    "image" => "blogs/blog1/image1.jpg",
    "excerpt" => "Explore the hottest wedding trends of 2025 — from sustainable celebrations to interactive guest experiences.",
    "slug" => "blog1"
  ],
  [
    "title" => "Designing a Luxurious Lifestyle at Home",
    "image" => "blogs/blog2/image1.jpg",
    "excerpt" => "Learn how to infuse luxury into your lifestyle with small yet impactful changes in your home and daily routines.",
    "slug" => "blog2"
  ],
  [
    "title" => "Destination Weddings in 2025",
    "image" => "blogs/blog3/image1.jpg",
    "excerpt" => "From palaces in Rajasthan to beachside celebrations in Bali, discover the most breathtaking destinations for weddings.",
    "slug" => "blog3"
  ],
  [
    "title" => "Wellness & Lifestyle for Couples",
    "image" => "blogs/blog4/image1.jpg",
    "excerpt" => "Healthy living together: tips for fitness, mindfulness, and relationship growth for modern couples.",
    "slug" => "blog4"
  ],
  [
    "title" => "Sustainable Wedding Planning",
    "image" => "blogs/blog5/image1.jpg",
    "excerpt" => "Eco-friendly weddings are the future. Here’s how you can plan a stylish yet sustainable celebration.",
    "slug" => "blog5"
  ],
  [
    "title" => "Modern Luxury Lifestyle Hacks",
    "image" => "blogs/blog6/image1.jpg",
    "excerpt" => "Luxury doesn’t have to be expensive. Discover modern lifestyle hacks to live elegantly every day.",
    "slug" => "blog6"
  ]
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Our Blogs</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #faf9f7;
      color: #333;
      margin: 0;
    }
    header {
      background: url('hero.jpg') center/cover no-repeat;
      color: white;
      text-align: center;
      padding: 6rem 2rem;
    }
    header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      margin-bottom: 1rem;
      text-shadow: 0 4px 18px rgba(0,0,0,0.45);
    }
    header p {
      font-size: 1.2rem;
      color: #f8f9fa;
    }

    #blogGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      padding: 3rem;
      max-width: 1200px;
      margin: auto;
    }

    .premium-card {
      border-radius: 16px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 6px 18px rgba(10,10,10,0.06);
      transition: transform .28s ease, box-shadow .28s ease;
    }
    .premium-card img {
      width: 100%;
      aspect-ratio: 3/2;
      object-fit: cover;
    }
    .premium-card .card-body {
      padding: 1.25rem;
    }
    .premium-card h5 {
      font-family: 'Playfair Display', serif;
      font-weight: 600;
      margin-bottom: .5rem;
      font-size: 1.25rem;
    }
    .premium-card p {
      font-size: .95rem;
      color: #555;
      line-height: 1.5;
      margin: .5rem 0 1rem;
    }
    .premium-card a {
      display: inline-block;
      padding: 6px 16px;
      background: #b88458;
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-size: .9rem;
      transition: background .3s ease;
    }
    .premium-card a:hover {
      background: #946a47;
    }
    .premium-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 40px rgba(10,10,10,0.12);
    }
  </style>
</head>
<body>
  <header>
    <h1>Our Blogs</h1>
    <p>Wedding inspirations & lifestyle insights curated for you</p>
  </header>

  <section id="blogGrid">
    <?php foreach ($blogs as $blog): ?>
      <div class="premium-card">
        <img src="<?= $blog['image'] ?>" alt="<?= $blog['title'] ?>">
        <div class="card-body">
          <h5><?= $blog['title'] ?></h5>
          <p><?= $blog['excerpt'] ?></p>
          <a href="single-blog.php?blog=<?= $blog['slug'] ?>">Read More</a>
        </div>
      </div>
    <?php endforeach; ?>
  </section>
</body>
</html> -->
