/**
 * Royal Shaadi Main JavaScript
 */

jQuery(document).ready(function($) {
    
    // Initialize Blog Carousel
    if (typeof Swiper !== 'undefined' && $('.blog-swiper').length) {
        new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.blog-nav-btn.swiper-button-next',
                prevEl: '.blog-nav-btn.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                }
            }
        });
    }
    
    // Initialize Vendor Carousel
    if (typeof Swiper !== 'undefined' && $('.vendor-swiper').length) {
        new Swiper('.vendor-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                }
            }
        });
    }
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });
    
    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }
            });
        }, observerOptions);
        
        $('.premium-card, .feature-card, .category-card, .stat-item').each(function() {
            observer.observe(this);
        });
    }
    
    // Newsletter form handler
    $('#newsletterForm').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const email = $form.find('input[type="email"]').val();
        const $submitBtn = $form.find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        // Show loading state
        $submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Subscribing...').prop('disabled', true);
        
        // AJAX call to subscribe
        $.ajax({
            url: royalShaadi.ajaxurl,
            type: 'POST',
            data: {
                action: 'subscribe_newsletter',
                email: email,
                nonce: royalShaadi.nonce
            },
            success: function(response) {
                if (response.success) {
                    alert('Thank you for subscribing! Check your email for confirmation.');
                    $form[0].reset();
                } else {
                    alert(response.data.message || 'Subscription failed. Please try again.');
                }
            },
            error: function() {
                alert('An error occurred. Please try again later.');
            },
            complete: function() {
                $submitBtn.html(originalText).prop('disabled', false);
            }
        });
    });
    
    // Vendor filter functionality
    $('#vendorFilterForm').on('submit', function(e) {
        e.preventDefault();
        const category = $('#vendorCategory').val();
        const location = $('#vendorLocation').val();
        
        $.ajax({
            url: royalShaadi.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_vendors',
                category: category,
                location: location,
                nonce: royalShaadi.nonce
            },
            beforeSend: function() {
                $('#vendorResults').html('<div class="text-center py-5"><i class="fas fa-spinner fa-spin fa-3x text-primary"></i></div>');
            },
            success: function(response) {
                if (response.success && response.data.length > 0) {
                    displayVendors(response.data);
                } else {
                    $('#vendorResults').html('<div class="text-center py-5"><p class="text-muted">No vendors found matching your criteria.</p></div>');
                }
            },
            error: function() {
                $('#vendorResults').html('<div class="text-center py-5"><p class="text-danger">Error loading vendors. Please try again.</p></div>');
            }
        });
    });
    
    // Function to display vendors
    function displayVendors(vendors) {
        let html = '<div class="row g-4">';
        
        vendors.forEach(vendor => {
            const image = vendor.thumbnail || royalShaadi.siteUrl + '/wp-content/themes/royal-shaadi/assets/images/vendor-placeholder.jpg';
            const rating = vendor.rating || '4.5';
            const category = vendor.category && vendor.category[0] ? vendor.category[0].name : '';
            
            html += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="vendor-card premium-card h-100">
                        <div class="card-image-container position-relative">
                            <img src="${image}" alt="${vendor.title}" class="card-img-top" />
                            <div class="card-overlay">
                                <div class="vendor-rating">
                                    <i class="fas fa-star text-warning"></i>
                                    <span>${rating}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <h5 class="card-title mb-2">${vendor.title}</h5>
                            ${category ? `<div class="mb-3"><span class="badge bg-primary-light text-primary rounded-pill">${category}</span></div>` : ''}
                            ${vendor.location ? `<p class="card-location text-muted mb-3"><i class="fas fa-map-marker-alt me-2"></i>${vendor.location}</p>` : ''}
                            <div class="card-footer-info d-flex justify-content-between align-items-center">
                                <div class="pricing">
                                    ${vendor.price_range ? `<span class="price-text fw-semibold text-primary">${vendor.price_range}</span>` : '<span class="price-text text-muted">Contact for pricing</span>'}
                                </div>
                                <a href="${vendor.permalink}" class="btn btn-primary btn-sm px-4 py-2">View Details</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        $('#vendorResults').html(html);
    }
    
    // Parallax effect for hero section
    $(window).on('scroll', function() {
        const scrolled = $(this).scrollTop();
        $('.hero-bg').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
    });
    
    // Add active class to current menu item
    const currentUrl = window.location.href;
    $('.navbar-nav .nav-link').each(function() {
        if ($(this).attr('href') === currentUrl) {
            $(this).addClass('active');
        }
    });
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Initialize tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Favorite vendor functionality (requires Firebase auth)
    $(document).on('click', '.favorite-btn', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const vendorId = $btn.data('vendor-id');
        const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
        
        if (!currentUser) {
            alert('Please login to save favorites');
            $('#loginModal').modal('show');
            return;
        }
        
        // Toggle favorite in Firebase
        const db = window.firebaseDb;
        if (db) {
            const userRef = db.collection('users').doc(currentUser.uid);
            const isFavorited = $btn.hasClass('favorited');
            
            if (isFavorited) {
                userRef.update({
                    favorites: firebase.firestore.FieldValue.arrayRemove(vendorId)
                });
                $btn.removeClass('favorited').html('<i class="far fa-heart"></i>');
            } else {
                userRef.update({
                    favorites: firebase.firestore.FieldValue.arrayUnion(vendorId)
                });
                $btn.addClass('favorited').html('<i class="fas fa-heart"></i>');
            }
        }
    });
});

// Function to handle vendor search with Firebase
async function searchVendorsFirebase(filters) {
    if (!window.getVendorsFromFirebase) {
        console.error('Firebase vendor search not available');
        return;
    }
    
    try {
        const vendors = await window.getVendorsFromFirebase(filters);
        console.log('Vendors from Firebase:', vendors);
        return vendors;
    } catch (error) {
        console.error('Error searching vendors:', error);
        return [];
    }
}