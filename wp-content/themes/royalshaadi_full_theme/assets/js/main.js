/**
 * RoyalShaadi — Main JS
 * Handles: nav, search overlay, scroll animations,
 *          category filter (homepage + archive), load more posts,
 *          vendor tab switching on homepage.
 */

(function () {
  'use strict';

  /* ============================================================
     DOM READY
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSearchOverlay();
    initScrollAnimations();
    initCategoryStrip();
    initBlogFilter();
    initLoadMore();
    initVendorTabs();
    initStickyHeader();
  });

  /* ============================================================
     STICKY HEADER (add shadow on scroll)
  ============================================================ */
  function initStickyHeader() {
    var header = document.getElementById('rs-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('rs-header--scrolled');
      } else {
        header.classList.remove('rs-header--scrolled');
      }
    }, { passive: true });
  }

  /* ============================================================
     NAVIGATION (hamburger + mobile menu)
  ============================================================ */
  function initNav() {
    var hamburger = document.getElementById('rs-hamburger');
    var menu      = document.getElementById('rs-nav-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Hamburger animation
    hamburger.addEventListener('click', function () {
      var spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* ============================================================
     SEARCH OVERLAY
  ============================================================ */
  function initSearchOverlay() {
    var toggle  = document.getElementById('rs-search-toggle');
    var overlay = document.getElementById('rs-search-overlay');
    var close   = document.getElementById('rs-search-close');
    if (!toggle || !overlay) return;

    function openSearch() {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () {
        var input = overlay.querySelector('input');
        if (input) input.focus();
      }, 150);
    }

    function closeSearch() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openSearch);
    if (close) close.addEventListener('click', closeSearch);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
    });
  }

  /* ============================================================
     SCROLL-TRIGGERED FADE UP ANIMATIONS
  ============================================================ */
  function initScrollAnimations() {
    var els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      els.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all immediately
      els.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ============================================================
     HOMEPAGE CATEGORY STRIP (decorative — filters visible posts)
  ============================================================ */
  function initCategoryStrip() {
    var pills = document.querySelectorAll('.rs-cat-strip__pill');
    if (!pills.length) return;

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');

        var filter = pill.dataset.filter;
        if (!filter) return; // "All" — do nothing on homepage

        // Smooth scroll to news section
        var newsSection = document.querySelector('.rs-news');
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ============================================================
     BLOG FILTER (archive.php — AJAX filter by section)
  ============================================================ */
  function initBlogFilter() {
    var chips  = document.querySelectorAll('.rs-blog-filter__chip');
    var sort   = document.getElementById('rs-sort-select');
    var grid   = document.getElementById('rs-masonry');
    var lmWrap = document.getElementById('rs-load-more-wrap');
    if (!chips.length || !grid) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        fetchPosts(chip.dataset.section || '', 1);
      });
    });

    if (sort) {
      sort.addEventListener('change', function () {
        var activeChip = document.querySelector('.rs-blog-filter__chip.active');
        var section = activeChip ? (activeChip.dataset.section || '') : '';
        fetchPosts(section, 1);
      });
    }

    function fetchPosts(section, page) {
      if (!window.rs_ajax) return;
      grid.classList.add('rs-loading');
      grid.style.opacity = '0.5';
      grid.style.pointerEvents = 'none';

      var data = new FormData();
      data.append('action', 'rs_load_more');
      data.append('nonce', rs_ajax.nonce);
      data.append('page', page);
      data.append('section', section);
      if (sort) data.append('orderby', sort.value);

      fetch(rs_ajax.url, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success) {
            grid.innerHTML = res.data.html;
            grid.style.opacity = '';
            grid.style.pointerEvents = '';
            grid.classList.remove('rs-loading');

            // Re-init scroll animations on new cards
            grid.querySelectorAll('.fade-up').forEach(function (el) {
              el.classList.add('visible');
            });

            // Update load more button
            if (lmWrap) {
              var btn = document.getElementById('rs-load-more');
              if (btn) {
                btn.dataset.page = 2;
                btn.dataset.section = section;
              }
              lmWrap.style.display = res.data.has_more ? '' : 'none';
            }
          }
        })
        .catch(function () {
          grid.style.opacity = '';
          grid.style.pointerEvents = '';
          grid.classList.remove('rs-loading');
        });
    }
  }

  /* ============================================================
     LOAD MORE POSTS (blog archive)
  ============================================================ */
  function initLoadMore() {
    var btn = document.getElementById('rs-load-more');
    var grid = document.getElementById('rs-masonry');
    if (!btn || !grid) return;

    btn.addEventListener('click', function () {
      if (!window.rs_ajax) return;
      var page    = parseInt(btn.dataset.page) || 2;
      var maxPage = parseInt(btn.dataset.max) || 1;
      var section = btn.dataset.section || '';

      if (page > maxPage) { btn.style.display = 'none'; return; }

      btn.textContent = 'Loading…';
      btn.classList.add('loading');
      btn.disabled = true;

      var data = new FormData();
      data.append('action', 'rs_load_more');
      data.append('nonce', rs_ajax.nonce);
      data.append('page', page);
      data.append('section', section);

      fetch(rs_ajax.url, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.success && res.data.html) {
            var temp = document.createElement('div');
            temp.innerHTML = res.data.html;
            Array.from(temp.children).forEach(function (child) {
              child.classList.add('visible'); // skip animation on appended
              grid.appendChild(child);
            });
            btn.dataset.page = page + 1;
            btn.textContent = 'Load More Stories';
            btn.classList.remove('loading');
            btn.disabled = false;
            if (!res.data.has_more) {
              btn.closest('.rs-load-more-wrap').style.display = 'none';
            }
          }
        })
        .catch(function () {
          btn.textContent = 'Load More Stories';
          btn.classList.remove('loading');
          btn.disabled = false;
        });
    });
  }

  /* ============================================================
     HOMEPAGE VENDOR TABS
  ============================================================ */
  function initVendorTabs() {
    var tabs = document.querySelectorAll('.rs-vendor-tab');
    var grid = document.getElementById('rs-homepage-vendors');
    if (!tabs.length || !grid) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var cat = tab.dataset.cat || '';
        if (!window.rs_ajax || !cat) return;

        grid.style.opacity = '0.5';
        var data = new FormData();
        data.append('action', 'rs_vendor_search');
        data.append('nonce', rs_ajax.nonce);
        data.append('category', cat);
        data.append('page', 1);

        fetch(rs_ajax.url, { method: 'POST', body: data })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res.success) {
              grid.innerHTML = res.data.html;
              grid.style.opacity = '';
            }
          })
          .catch(function () { grid.style.opacity = ''; });
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLL FOR HERO SCROLL INDICATOR
  ============================================================ */
  var scrollIndicator = document.querySelector('.rs-hero__scroll');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      var target = document.querySelector('.rs-cat-strip') || document.querySelector('.rs-featured');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

})();