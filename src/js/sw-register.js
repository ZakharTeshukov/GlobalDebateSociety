/**
 * Service Worker Registration Helper Script
 * 
 * This script handles registering the service worker and provides a mechanism to update
 * when new versions are available.
 */

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/src/js/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                
                // Check for service worker updates
                registration.addEventListener('updatefound', () => {
                    // An updated service worker has appeared in registration.installing
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        // Show a notification when the new service worker is activated
                        if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                            // Create update notification
                            createUpdateNotification();
                        }
                    });
                });
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
            
        // Listen for controller change
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}

/**
 * Creates a notification to inform users about available updates
 */
function createUpdateNotification() {
    // Only create if not already shown
    if (document.querySelector('.update-notification')) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <p>A new version is available!</p>
        <button class="update-button">Update Now</button>
        <button class="close-button"><i class="fas fa-times"></i></button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #3a86ff;
        color: white;
        padding: 12px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        z-index: 9999;
        font-family: 'Montserrat', sans-serif;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Handle update button click
    notification.querySelector('.update-button').addEventListener('click', () => {
        // Tell the service worker to skipWaiting
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
        }
        // Remove the notification
        document.body.removeChild(notification);
    });
    
    // Handle close button click
    notification.querySelector('.close-button').addEventListener('click', () => {
        // Remove the notification
        document.body.removeChild(notification);
    });
} 