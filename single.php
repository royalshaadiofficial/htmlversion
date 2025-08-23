<?php
require_once 'functions.php';
$id = isset($_GET['id']) ? $_GET['id'] : 0;
$post = get_post_by_id($id);
if(!$post) {
  $page_title = 'Post not found';
  include 'header.php';
  echo '<main class="container"><h1>Post not found</h1></main>';
  include 'footer.php';
  exit;
}
$page_title = $post['title'] ?? 'Post';
include 'header.php';
?>
<main class="container">
  <div class="blog-layout">
    <article>
      <h1><?php echo htmlspecialchars($post['title'] ?? ''); ?></h1>
      <p class="meta"><?php echo date('F j, Y', strtotime($post['created_at'])); ?></p>
      <?php if(isset($post['image'])): ?>
        <img src="<?php echo htmlspecialchars($post['image']); ?>" alt="" style="width:100%;margin-bottom:1rem;border-radius:10px">
      <?php endif; ?>
      <div class="post-content card" style="padding:1rem">
        <?php
          $content = $post['content'] ?? $post['excerpt'] ?? '';
          echo $content;
        ?>
      </div>
    </article>
    <aside class="sidebar">
      <div class="toc">
        <h4>Table of contents</h4>
        <div id="postToc">
        </div>
      </div>
      <div style="margin-top:1rem" class="card">
        <h4>More from us</h4>
        <ul>
          <li><a href="#">How to pick bridal jewellery</a></li>
          <li><a href="#">Top 10 hotels for weddings</a></li>
        </ul>
      </div>
    </aside>
  </div>
</main>
<script>
document.addEventListener('DOMContentLoaded', ()=>{
  const content = document.querySelector('.post-content');
  const toc = document.getElementById('postToc');
  if(!content || !toc) return;
  const headings = content.querySelectorAll('h2, h3');
  if(headings.length === 0){
    toc.innerHTML = '<p style="color:var(--muted)">No sections</p>';
    return;
  }
  const ul = document.createElement('ul');
  headings.forEach((h, i)=>{
    const id = h.id || ('heading-'+i);
    h.id = id;
    const li = document.createElement('li');
    li.style.marginBottom = '0.4rem';
    const a = document.createElement('a');
    a.href = '#'+id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });
  toc.appendChild(ul);
});
</script>
<?php include 'footer.php'; ?>