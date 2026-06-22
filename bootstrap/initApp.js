/**
 * MLPA Prototype - App Initialization Module
 * 
 * Main entry point for application bootstrap.
 * Composes all bootstrap modules and initializes the app.
 */

const InitApp = (function () {
    'use strict';

    /**
     * Initialize the application.
     * @param {Object} elements - Elements object to populate
     * @param {Object} state - Application state
     * @param {Object} handlers - All event handler functions
     */
    function init(elements, state, handlers) {
        // 1. Cache DOM elements
        if (window.DOMCache) {
            window.DOMCache.cacheElements(elements);
        }

        // 2. Bind all events
        if (window.BindEvents) {
            window.BindEvents.bindAll(elements, handlers);
        }

        // 3. Initialize network resilience
        if (window.OfflineOverlay) {
            window.OfflineOverlay.init();
        }

        // 4. Initialize upload error modal
        if (window.UploadErrorModal) {
            window.UploadErrorModal.init(handlers.handleLoadMock);
        }

        // 5. Show initial screen
        if (window.ScreenNav) {
            window.ScreenNav.showScreen(1, state, elements);
        }

        // 6. Set up global exposures
        window.goToScreen = (screenNumber) => {
            if (window.ScreenNav) {
                window.ScreenNav.showScreen(screenNumber, state, elements);
            }
        };

        window.getAppState = () => ({ ...state });
    }

    return { init };
})();

if (typeof window !== 'undefined') {
    window.InitApp = InitApp;
}
