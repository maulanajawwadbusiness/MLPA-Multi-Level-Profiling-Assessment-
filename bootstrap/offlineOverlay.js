/**
 * MLPA Prototype - Offline Overlay Module
 * 
 * Handles network status detection and offline overlay display.
 */

const OfflineOverlay = (function () {
    'use strict';

    /**
     * Initialize offline detection and overlay.
     */
    function init() {
        const overlay = document.getElementById('offline-overlay');

        // Check initial state
        if (!navigator.onLine) {
            overlay?.classList.remove('hidden');
        }

        // Listen for network changes
        window.addEventListener('online', () => {
            console.log('[MLPA] Network: Back online');
            overlay?.classList.add('hidden');
        });

        window.addEventListener('offline', () => {
            console.log('[MLPA] Network: Went offline');
            overlay?.classList.remove('hidden');
        });
    }

    return { init };
})();

if (typeof window !== 'undefined') {
    window.OfflineOverlay = OfflineOverlay;
}
