// Wallpaper pack download functionality

// iCloud sharing links for each wallpaper pack
const wallpaperPacks = {
    'nature-collection': {
        name: 'Nature Collection',
        icloudLink: 'https://www.icloud.com/sharedalbum/#B2EGWZuqDPvjNXQ', // Replace with your actual iCloud link
        count: 18,
        description: 'Beautiful nature photography'
    },
    'urban-landscapes': {
        name: 'Urban Landscapes',
        icloudLink: 'https://www.icloud.com/sharedalbum/#B2E5qXGF1rJyLd1', // Replace with your actual iCloud link
        count: 15,
        description: 'City scenes and architecture'
    },
    'complete-collection': {
        name: 'Complete Collection',
        icloudLink: 'https://www.icloud.com/sharedalbum/#B2EG4TcsmPYm2pO', // Replace with your actual iCloud link
        count: 50,
        description: 'All wallpapers in one collection'
    }
};

// Download pack function
function downloadPack(packId) {
    const pack = wallpaperPacks[packId];
    
    if (!pack) {
        console.error('Pack not found:', packId);
        return;
    }

    // Show download confirmation
    const confirmDownload = confirm(
        `You're about to download "${pack.name}" (${pack.count} images).\n\n` +
        `This will open an iCloud sharing link where you can download all the wallpapers.\n\n` +
        `Click OK to continue to iCloud.`
    );

    if (confirmDownload) {
        // Track download (you can add analytics here if needed)
        trackDownload(packId, pack.name);
        
        // Open iCloud link in new tab
        window.open(pack.icloudLink, '_blank');
        
        // Show success message
        showDownloadSuccess(pack.name);
    }
}

// Preview pack function (placeholder for future implementation)
function previewPack(packId) {
    const pack = wallpaperPacks[packId];
    
    if (!pack) {
        console.error('Pack not found:', packId);
        return;
    }

    // For now, show an alert with pack info
    // In the future, you could implement a modal gallery
    alert(
        `Preview: ${pack.name}\n\n` +
        `${pack.description}\n` +
        `Contains ${pack.count} high-quality 4K wallpapers.\n\n` +
        `Preview functionality coming soon! For now, you can download the pack to see all images.`
    );
}

// Track download for analytics (optional)
function trackDownload(packId, packName) {
    console.log(`Download initiated: ${packName} (${packId})`);
    
    // You can add Google Analytics or other tracking here
    // Example:
    // gtag('event', 'download', {
    //     'event_category': 'wallpaper_pack',
    //     'event_label': packName,
    //     'value': 1
    // });
}

// Show download success message
function showDownloadSuccess(packName) {
    // Create a temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'download-success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>Opening "${packName}" in iCloud...</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(successMessage);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(successMessage)) {
            document.body.removeChild(successMessage);
        }
    }, 3000);
}

// Filter functionality (if you want to add category filtering)
function filterPacks(category) {
    const packs = document.querySelectorAll('.wallpaper-pack');
    
    packs.forEach(pack => {
        if (category === 'all') {
            pack.style.display = 'block';
        } else {
            const packCategories = pack.dataset.categories;
            if (packCategories && packCategories.includes(category)) {
                pack.style.display = 'block';
            } else {
                pack.style.display = 'none';
            }
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wallpapers page loaded');
    
    // Add any initialization code here
    
    // Example: Add smooth scrolling to download instructions
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a small delay to show button click effect
            setTimeout(() => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            }, 50);
        });
    });
});

// Utility function to update iCloud links
function updateiCloudLink(packId, newLink) {
    if (wallpaperPacks[packId]) {
        wallpaperPacks[packId].icloudLink = newLink;
        console.log(`Updated iCloud link for ${packId}: ${newLink}`);
    }
}

// Export functions for global use
window.downloadPack = downloadPack;
window.previewPack = previewPack;
window.filterPacks = filterPacks;
window.updateiCloudLink = updateiCloudLink;
