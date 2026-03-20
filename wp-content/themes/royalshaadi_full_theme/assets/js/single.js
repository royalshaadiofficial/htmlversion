/**
 * RoyalShaadi — Single Post JS
 * Handles: reading progress bar, sticky share bar, image lightbox.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initStickyShare();
    initLightbox();
  });

  /* ============================================================
     READING PROGRESS BAR
  ============================================================ */
  function initReadingProgress() {
    var article = document.querySelector('.rs-post-content');
    if (!article) return;

    var bar = document.createElement('div');
    bar.id = 'rs-progress-bar';
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:var(--gold);z-index:9999;width:0%;transition:width 0.1s linear;';
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var articleTop    = article.offsetTop;
      var articleHeight = article.offsetHeight;
      var scrolled      = window.scrollY - articleTop;
      var total         = articleHeight - window.innerHeight;
      var pct           = Math.min(100, Math.max(0, (scrolled / total) * 100));
      bar.style.width   = pct + '%';
    }, { passive: true });
  }

  /* ============================================================
     STICKY SHARE — hide when hero is visible, show when scrolled
  ============================================================ */
  function initStickyShare() {
    var share = document.querySelector('.rs-post-share');
    if (!share) return;

    var hero = document.querySelector('.rs-post-hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      if (window.scrollY > heroBottom) {
        share.style.opacity = '1';
        share.style.pointerEvents = '';
      } else {
        share.style.opacity = '0';
        share.style.pointerEvents = 'none';
      }
    }, { passive: true });

    // Start hidden
    share.style.opacity = '0';
    share.style.transition = 'opacity 0.3s ease';
    share.style.pointerEvents = 'none';
  }

  /* ============================================================
     SIMPLE LIGHTBOX FOR POST IMAGES
  ============================================================ */
  function initLightbox() {
    var content = document.querySelector('.rs-post-content');
    if (!content) return;

    var images = content.querySelectorAll('img');
    if (!images.length) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.id = 'rs-lightbox';
    overlay.style.cssText = [
      'position:fixed;inset:0;background:rgba(10,7,2,0.96);z-index:10000;',
      'display:none;align-items:center;justify-content:center;cursor:zoom-out;'
    ].join('');

    var img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;box-shadow:0 0 80px rgba(201,168,76,0.15);';

    var close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = 'position:absolute;top:24px;right:32px;background:none;border:none;color:rgba(255,255,255,0.5);font-size:28px;cursor:pointer;line-height:1;transition:color 0.2s;';
    close.addEventListener('mouseenter', function () { close.style.color = 'var(--gold)'; });
    close.addEventListener('mouseleave', function () { close.style.color = 'rgba(255,255,255,0.5)'; });

    overlay.appendChild(img);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    function openLightbox(src, alt) {
      img.src = src;
      img.alt = alt || '';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      img.src = '';
    }

    images.forEach(function (image) {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', function () {
        openLightbox(image.src, image.alt);
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === img) closeLightbox();
    });
    close.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') closeLightbox();
    });
  }

})();