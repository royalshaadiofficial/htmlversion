<?php
function get_latest_posts($limit = 5) {
  $dir = __DIR__ . '/blog_posts';
  $posts = [];
  if(is_dir($dir)) {
    $files = glob($dir . '/*.html');
    rsort($files);
    foreach(array_slice($files,0,$limit) as $f){
      $slug = basename($f, '.html');
      $content = file_get_contents($f);
      preg_match('/<h1.*?>(.*?)<\/h1>/s', $content, $mTitle);
      preg_match('/<p.*?>(.*?)<\/p>/s', $content, $mP);
      preg_match('/<img.*?src=["\'](.*?)["\'].*?>/s', $content, $mImg);
      $posts[] = [
        'id' => $slug,
        'title' => $mTitle[1] ?? $slug,
        'excerpt' => strip_tags($mP[1] ?? ''),
        'image' => $mImg[1] ?? 'assets/images/blog1.jpg',
        'created_at' => date('Y-m-d', filemtime($f))
      ];
    }
  }
  return $posts;
}

function get_post_by_id($id) {
  $path = __DIR__ . '/blog_posts/' . basename($id) . '.html';
  if(file_exists($path)) {
    $content = file_get_contents($path);
    preg_match('/<h1.*?>(.*?)<\/h1>/s', $content, $mTitle);
    return ['id'=>$id, 'title'=>$mTitle[1] ?? $id, 'content'=>$content, 'image'=>'assets/images/blog1.jpg', 'created_at'=>date('Y-m-d', filemtime($path))];
  }
  return null;
}
