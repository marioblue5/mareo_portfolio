// Lightbox initialization and configuration
$(document).ready(function () {
    console.log('🚀 Initializing Mario\'s Portfolio Lightbox...');

    // Track current gallery and caption to prevent flashing
    let currentGallery = null;
    let currentCaption = null;

    // Check if lightbox is loaded
    if (typeof lightbox !== 'undefined') {
        console.log('✅ Lightbox found! Configuring options...');

        // Configure lightbox options
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true, // We keep this true to detect wraps
            'albumLabel': "Image %1 of %2",
            'fadeDuration': 300,
            'imageFadeDuration': 300,
            'maxWidth': 1200,
            'maxHeight': 800,
            'showImageNumberLabel': true,
            'alwaysShowNavOnTouchDevices': true,
            'disableScrolling': true,
            'sanitizeTitle': false
        });

        console.log('✅ Lightbox configured successfully!');

        // --- Override Lightbox Functions ---

        // 1. Override changeImage to detect wrapping (Cross-Project Nav) - REMOVED


        // 2. Override updateDetails to Fix Duplication & Add Scrolling
        if (lightbox.updateDetails) {
            const originalUpdateDetails = lightbox.updateDetails.bind(lightbox);
            lightbox.updateDetails = function () {
                // Get the current image element to access custom attributes
                // FIX: Scope to current gallery to avoid ambiguity with shared images
                const currentLink = this.album[this.currentImageIndex] ?
                    $('a[data-lightbox="' + currentGallery + '"][href="' + this.album[this.currentImageIndex].link + '"]') : null;

                const newGallery = currentLink ? currentLink.attr('data-lightbox') : null;

                // FIX: Always read from DOM, never from this.album[i].title (which gets mutated)
                const projectDesc = currentLink ? currentLink.attr('data-project-description') : '';
                const imageCaption = currentLink ? currentLink.attr('data-title') : ''; // Read original caption

                // Combine them: Description + Separator + Caption
                let combinedCaption = '';

                // Add Scrollable Container for Description
                if (projectDesc) {
                    combinedCaption += `<div class="lb-project-desc-scroll" style="max-height: 450px; overflow-y: auto; padding-right: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); scrollbar-width: thin; scrollbar-color: #28e98c rgba(255,255,255,0.1);">
                        ${projectDesc}
                    </div>`;
                }

                if (imageCaption) {
                    combinedCaption += '<span class="lb-image-caption" style="font-size: 14px; color: #ddd; font-style: italic; display: block; margin-top: 5px;">' + imageCaption + '</span>';
                }

                const newCaption = combinedCaption;

                // Update tracking
                currentGallery = newGallery;
                currentCaption = newCaption;

                // Temporarily override the title for the original function to render
                if (this.album[this.currentImageIndex]) {
                    this.album[this.currentImageIndex].title = newCaption;
                }

                originalUpdateDetails();
            };
        }

    } else {
        console.error('❌ Lightbox not found! Check if lightbox.min.js is loaded.');
    }

    // Add click event logging for debugging
    $('a[data-lightbox]').on('click', function (e) {
        // Reset tracking when opening lightbox
        currentGallery = $(this).attr('data-lightbox');
        currentCaption = $(this).attr('data-title'); // Initial caption
    });

    // Add keyboard navigation hint
    $(document).on('keydown', function (e) {
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