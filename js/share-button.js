document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('share-buttons-container');
    if (!container) return; 

    // --- 1. Get Dynamic Data ---
    const pageUrl = window.location.href;
    const url = encodeURIComponent(pageUrl);
    
    // Get attributes and use them in PLAIN text for the native Web Share API
    const plainTitle = container.getAttribute('data-title') || 'Check out this page';
    const plainText = (container.getAttribute('data-text') || 'Check this out: ') + plainTitle;
    
    // Encode the title and text for URL construction
    const encodedTitle = encodeURIComponent(plainTitle);
    const encodedText = encodeURIComponent(plainText);
    const hashtags = container.getAttribute('data-hashtags') || '';

    // --- 2. Define Share URLs (Use Encoded Text) ---
    const shareUrls = {
        // Facebook URL updated for better mobile redirection
        facebook: `https://m.facebook.com/sharer.php?u=${url}`, 
        
        // Use encoded text and title for all URL-based sharing
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${encodedText}&hashtags=${hashtags}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodedTitle}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${url}`,
        telegram: `https://telegram.me/share/url?url=${url}&text=${encodedText}`
    };

    // --- 3. Set HREFs for specific platforms ---
    container.querySelectorAll('.share-button').forEach(button => {
        const platform = button.classList[1]; 
        if (shareUrls[platform]) {
            button.setAttribute('href', shareUrls[platform]);
        }
    });

    // --- 4. Handle General Share Button (Web Share API) ---
    const generalShareButton = container.querySelector('.general-share');
    if (generalShareButton) {
        if (navigator.share) {
            // Web Share API is supported (mostly mobile)
            generalShareButton.addEventListener('click', async () => {
                try {
                    // Use PLAIN, non-encoded text and title for the native API
                    await navigator.share({
                        title: plainTitle,
                        text: plainText, 
                        url: pageUrl // Use the original, non-encoded URL
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                    // Fallback to simple link copy if the user cancels or an error occurs
                    fallbackCopyLink(pageUrl, generalShareButton);
                }
            });
        } else {
            // Web Share API is not supported (mostly desktop/older browsers)
            generalShareButton.addEventListener('click', () => {
                // For the copy fallback, we only want to copy the URL itself, not the text
                fallbackCopyLink(pageUrl, generalShareButton);
            });
        }
    }
});

/**
 * Fallback function to copy the link to the clipboard.
 * This function only copies the clean URL to prevent issues with encoded text.
 */
function fallbackCopyLink(url, buttonElement) {
    navigator.clipboard.writeText(url).then(() => {
        // Provide visual feedback
        const originalIcon = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fa fa-check"></i>'; // Change icon to a checkmark
        
        // If your icon requires 'fab' instead of 'fa' for the share-alt icon, adjust here
        const shareIconClass = (originalIcon.includes('fa-share-alt') && originalIcon.includes('fab')) ? 'fab fa-share-alt' : 'fa fa-share-alt';

        setTimeout(() => {
            buttonElement.innerHTML = `<i class="${shareIconClass}"></i>`; // Revert after 2 seconds
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Alert the user if clipboard access failed entirely
        alert('Could not automatically copy the link. Please copy this URL manually: ' + url);
    });
}