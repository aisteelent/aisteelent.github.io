/*
 * JavaScript for the Inquiry Popup Functionality
 * Insert this just before the closing </body> tag in your index.html
 */
document.addEventListener('DOMContentLoaded', function() {
    const inquiryContainer = document.getElementById('inquiryContainer');
    const toggleButton = document.getElementById('inquiryToggleButton');
    const permanentCloseButton = document.getElementById('permanentCloseInquiryButton');

    let collapseTimer = null;
    let shakeInterval;
    let isMobile = false;
    const SHAKE_DURATION = 500;
    const SHAKE_INTERVAL_DELAY = 2000;
    const COLLAPSE_DELAY = 10000;
    const DESKTOP_BREAKPOINT = 768;

    // Checks if the current screen width is mobile
    function checkIsMobile() {
        return window.innerWidth <= DESKTOP_BREAKPOINT;
    }

    // Function to start the shaking animation
    function startShaking() {
        stopShaking();
        shakeInterval = setInterval(() => {
            // Only shake if the container is not in the active (interactive) state
            if (!inquiryContainer.classList.contains('active')) {
                toggleButton.classList.add('shake-animation');
                setTimeout(() => {
                    toggleButton.classList.remove('shake-animation');
                }, SHAKE_DURATION);
            }
        }, SHAKE_INTERVAL_DELAY);
    }

    // Function to stop the shaking animation
    function stopShaking() {
        clearInterval(shakeInterval);
        toggleButton.classList.remove('shake-animation');
    }

    // Function to add the 'collapsed' class and start shaking
    function collapseButtonAndStartShaking() {
        // Only collapse if on mobile, button is not active, and not already hidden
        if (isMobile && !inquiryContainer.classList.contains('active') && !inquiryContainer.classList.contains('hidden')) {
            toggleButton.classList.add('collapsed');
            startShaking();
        }
    }

    // Function to remove the 'collapsed' class and stop shaking
    function expandButtonAndStopShaking() {
        toggleButton.classList.remove('collapsed');
        stopShaking();
    }

    // Function to reset the collapse timer
    function resetCollapseTimer() {
        clearTimeout(collapseTimer);
        if (isMobile) {
            collapseTimer = setTimeout(collapseButtonAndStartShaking, COLLAPSE_DELAY);
        }
    }

    // Function to manage the state of the mobile buttons
    function toggleMobileButtons() {
        // This function only runs on mobile
        if (!isMobile) return;

        // Toggle the 'active' class to show/hide the two new buttons
        const isCurrentlyActive = inquiryContainer.classList.toggle('active');

        if (isCurrentlyActive) {
            // State: Interactive (buttons are visible)
            // Ensure the main button is expanded and stops shaking
            expandButtonAndStopShaking();
            // Clear the auto-collapse timer
            clearTimeout(collapseTimer);
        } else {
            // State: Idle (buttons are hidden)
            // Reset the collapse timer
            resetCollapseTimer();
            // Start the shaking animation
            startShaking();
        }
    }

    // Function to hide the entire inquiry button container
    function hideEntireInquiryButton() {
        // Ensure mobile buttons are closed first
        if (inquiryContainer.classList.contains('active')) {
            inquiryContainer.classList.remove('active');
        }
        inquiryContainer.classList.add('hidden');
        clearTimeout(collapseTimer);
        stopShaking();
    }

    // Main button click listener
    toggleButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior if any

        if (checkIsMobile()) {
            // Mobile: Toggle the two new buttons
            toggleMobileButtons();
        } else {
            // Desktop: Direct link to WhatsApp
            window.open('https://wa.me/919811540458', '_blank');
        }
    });

    // Permanent close button listener
    if (permanentCloseButton) {
        permanentCloseButton.addEventListener('click', function(event) {
            event.stopPropagation();
            hideEntireInquiryButton();
        });
    }

    // Close the mobile buttons if clicking outside of the container
    document.addEventListener('click', function(event) {
        if (inquiryContainer.classList.contains('active') && !inquiryContainer.contains(event.target)) {
            toggleMobileButtons();
        }
    });

    // Initial setup and resize handler
    function initializeButton() {
        isMobile = checkIsMobile();
        if (isMobile) {
            // On mobile, start the shaking and the collapse timer
            startShaking();
            resetCollapseTimer();
        } else {
            // On desktop, ensure it's always expanded and shaking
            expandButtonAndStopShaking();
            startShaking();
        }
    }

    window.addEventListener('load', initializeButton);
    window.addEventListener('resize', initializeButton);

    // Initial call to set state on page load
    initializeButton();
});