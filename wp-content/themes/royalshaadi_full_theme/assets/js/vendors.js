/**
 * RoyalShaadi — Vendor Search Page JS
 * Handles: keyword + category + city search, filter sidebar,
 *          AJAX results, load more vendors, sort.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('rs-vendor-grid')) return;
    initVendorSearch();
  });

  function initVendorSearch() {
    var keywordInput  = document.getElementById('vs-keyword');
    var categorySelect = document.getElementById('vs-category');
    var citySelect    = document.getElementById('vs-city');
    var searchBtn     = document.getElementById('vs-search-btn');
    var applyBtn      = document.getElementById('vs-apply-filters');
    var clearBtn      = document.getElementById('vs-clear-filters');
    var sortSelect    = document.getElementById('vs-sort');
    var grid          = document.getElementById('rs-vendor-grid');
    var countEl       = document.getElementById('vs-count');
    var loadMoreWrap  = document.getElementById('vs-load-more-wrap');
    var loadMoreBtn   = document.getElementById('vs-load-more');

    if (!grid) return;

    // ---- SEARCH / APPLY -------------------------------------------
    function doSearch(page) {
      page = page || 1;
      if (!window.rs_ajax) return;

      var keyword  = keywordInput  ? keywordInput.value.trim()    : '';
      var category = categorySelect ? categorySelect.value         : '';
      var city     = citySelect     ? citySelect.value             : '';
      var orderby  = sortSelect     ? sortSelect.value             : 'date';

      // Collect sidebar checkboxes
      var checkedCats = Array.from(document.querySelectorAll('input[name="cat_filter"]:checked')).map(function (el) { return el.value; });
      var checkedCities = Array.from(document.querySelectorAll('input[name="city_filter"]:checked')).map(function (el) { return el.value; });
      var rating = (document.querySelector('input[name="rating"]:checked') || {}).value || '';

      if (!category && checkedCats.length === 1) category = checkedCats[0];
      if (!city && checkedCities.length === 1) city = checkedCities[0];

      setLoading(true, page);

      var data = new FormData();
      data.append('action',   'rs_vendor_search');
      data.append('nonce',    rs_ajax.nonce);
      data.append('keyword',  keyword);
      data.append('category', category);
      data.append('city',     city);
      data.append('rating',   rating);
      data.append('orderby',  orderby);
      data.append('page',     page);

      fetch(rs_ajax.url, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          setLoading(false);
          if (!res.success) return;

          if (page === 1) {
            grid.innerHTML = res.data.html;
          } else {
            var temp = document.createElement('div');
            temp.innerHTML = res.data.html;
            Array.from(temp.children).forEach(function (c) { grid.appendChild(c); });
          }

          // Update count
          if (countEl) {
            countEl.innerHTML = '<strong>' + res.data.count + '</strong> vendors found';
          }

          // Load more visibility
          if (loadMoreWrap) {
            loadMoreWrap.style.display = res.data.has_more ? '' : 'none';
            if (loadMoreBtn) {
              loadMoreBtn.dataset.page = page + 1;
              loadMoreBtn.disabled = false;
              loadMoreBtn.textContent = 'Load More Vendors';
            }
          }
        })
        .catch(function () { setLoading(false); });
    }

    // ---- LOADING STATE -------------------------------------------
    function setLoading(on, page) {
      if (on && page === 1) {
        grid.innerHTML = skeletonCards(6);
        grid.style.opacity = '0.6';
      } else {
        grid.style.opacity = '';
      }
      if (searchBtn) { searchBtn.disabled = on; searchBtn.textContent = on ? 'Searching…' : 'Search Vendors'; }
      if (applyBtn)  { applyBtn.disabled  = on; }
    }

    function skeletonCards(n) {
      var html = '';
      for (var i = 0; i < n; i++) {
        html += '<div class="rs-vendor-card rs-vendor-card--skeleton">' +
          '<div class="rs-vendor-card__img-wrap" style="height:190px"></div>' +
          '<div class="rs-vendor-card__body" style="opacity:0.3">' +
          '<div style="height:10px;background:#e0e0e0;width:40%;margin-bottom:10px"></div>' +
          '<div style="height:18px;background:#e0e0e0;width:70%;margin-bottom:6px"></div>' +
          '<div style="height:12px;background:#e0e0e0;width:50%"></div>' +
          '</div></div>';
      }
      return html;
    }

    // ---- EVENT LISTENERS -----------------------------------------

    // Main search button
    if (searchBtn) {
      searchBtn.addEventListener('click', function () { doSearch(1); });
    }

    // Enter key on keyword input
    if (keywordInput) {
      keywordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doSearch(1);
      });
    }

    // Live search on category / city dropdowns
    if (categorySelect) categorySelect.addEventListener('change', function () { doSearch(1); });
    if (citySelect) citySelect.addEventListener('change', function () { doSearch(1); });

    // Sort change
    if (sortSelect) sortSelect.addEventListener('change', function () { doSearch(1); });

    // Apply sidebar filters
    if (applyBtn) applyBtn.addEventListener('click', function () { doSearch(1); });

    // Clear filters
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        if (keywordInput)   keywordInput.value   = '';
        if (categorySelect) categorySelect.value = '';
        if (citySelect)     citySelect.value     = '';
        if (sortSelect)     sortSelect.value     = 'date';
        document.querySelectorAll('input[name="cat_filter"]').forEach(function (el) { el.checked = false; });
        document.querySelectorAll('input[name="city_filter"]').forEach(function (el) { el.checked = false; });
        var allRating = document.querySelector('input[name="rating"][value=""]');
        if (allRating) allRating.checked = true;
        doSearch(1);
      });
    }

    // Load more
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        var page = parseInt(loadMoreBtn.dataset.page) || 2;
        var max  = parseInt(loadMoreBtn.dataset.max)  || 1;
        if (page > max) { loadMoreWrap.style.display = 'none'; return; }
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = 'Loading…';
        doSearch(page);
      });
    }

    // ---- URL PARAMS (deep linking) --------------------------------
    (function parseUrlParams() {
      var params = new URLSearchParams(window.location.search);
      var kw  = params.get('keyword')  || params.get('s') || '';
      var cat = params.get('category') || '';
      var cty = params.get('city')     || '';
      var hasParams = kw || cat || cty;

      if (kw  && keywordInput)   keywordInput.value   = kw;
      if (cat && categorySelect) categorySelect.value = cat;
      if (cty && citySelect)     citySelect.value     = cty;

      if (hasParams) doSearch(1);
    })();
  }

})();