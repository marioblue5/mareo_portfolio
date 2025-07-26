// Lightbox initialization and configuration
$(document).ready(function() {
    console.log('🚀 Initializing Mario\'s Portfolio Lightbox...');
    
    // Track current gallery and caption to prevent flashing
    let currentGallery = null;
    let currentCaption = null;
    
    // Check if lightbox is loaded
    if (typeof lightbox !== 'undefined') {
        console.log('✅ Lightbox found! Configuring options...');
        
        // Configure lightbox options for better user experience
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': "Project %1 of %2",
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'maxWidth': 1200,
            'maxHeight': 800,
            'showImageNumberLabel': true,
            'alwaysShowNavOnTouchDevices': true,
            'disableScrolling': true,
            'sanitizeTitle': false  // Allow HTML in captions!
        });
        
        console.log('✅ Lightbox configured successfully!');
        console.log('🔗 Found ' + $('a[data-lightbox]').length + ' lightbox items');
        
        // Override lightbox's updateDetails function to prevent caption flashing
        if (lightbox.updateDetails) {
            const originalUpdateDetails = lightbox.updateDetails.bind(lightbox);
            lightbox.updateDetails = function() {
                const newGallery = this.album[this.currentImageIndex] ? 
                    $('a[href="' + this.album[this.currentImageIndex].link + '"]').attr('data-lightbox') : null;
                const newCaption = this.album[this.currentImageIndex] ? this.album[this.currentImageIndex].title : null;
                
                // Only update caption if we're switching galleries or if caption actually changed
                if (newGallery !== currentGallery || newCaption !== currentCaption) {
                    currentGallery = newGallery;
                    currentCaption = newCaption;
                    originalUpdateDetails();
                } else {
                    // Just update the image counter without flashing the caption
                    if (this.album.length > 1 && this.options.showImageNumberLabel) {
                        var c = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
                        this.$lightbox.find('.lb-number').text(c).fadeIn('fast');
                    } else {
                        this.$lightbox.find('.lb-number').hide();
                    }
                    this.$outerContainer.removeClass('animating');
                }
            };
        }
        
    } else {
        console.error('❌ Lightbox not found! Check if lightbox.min.js is loaded.');
        
        // Fallback: Try to load lightbox from CDN
        console.log('🔄 Attempting to load lightbox from CDN...');
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js')
            .done(function() {
                console.log('✅ Lightbox loaded from CDN!');
                // Retry configuration
                if (typeof lightbox !== 'undefined') {
                    lightbox.option({
                        'resizeDuration': 200,
                        'wrapAround': true,
                        'albumLabel': "Project %1 of %2",
                        'fadeDuration': 300,
                        'sanitizeTitle': false
                    });
                }
            })
            .fail(function() {
                console.error('❌ Failed to load lightbox from CDN');
            });
    }
    
    // Add click event logging for debugging
    $('a[data-lightbox]').on('click', function(e) {
        console.log('🖱️ Portfolio item clicked:', $(this).attr('href'));
        console.log('📝 Title preview:', $(this).attr('data-title').substring(0, 100) + '...');
        
        // Reset tracking when opening lightbox
        currentGallery = $(this).attr('data-lightbox');
        currentCaption = $(this).attr('data-title');
        
        // If lightbox isn't working, prevent default and show alert
        if (typeof lightbox === 'undefined') {
            e.preventDefault();
            alert('Lightbox not loaded properly. Please refresh the page and try again.');
            return false;
        }
    });
    
    // Add keyboard navigation hint
    $(document).on('keydown', function(e) {
        if ($('.lb-overlay').is(':visible')) {
            if (e.keyCode === 27) { // ESC key
                console.log('⌨️ ESC pressed - closing lightbox');
            }
        }
    });
});

// Additional debugging function
function debugLightbox() {
    console.log('=== LIGHTBOX DEBUG INFO ===');
    console.log('Lightbox available:', typeof lightbox !== 'undefined');
    console.log('jQuery available:', typeof $ !== 'undefined');
    console.log('Portfolio items found:', $('a[data-lightbox]').length);
    console.log('Lightbox items:', $('a[data-lightbox]').toArray().map(el => el.href));
    console.log('========================');
}