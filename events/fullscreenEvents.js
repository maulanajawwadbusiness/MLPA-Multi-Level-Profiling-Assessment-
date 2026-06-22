/**
 * MLPA Prototype - Fullscreen Events Module
 * 
 * Handles fullscreen toggle button and fullscreen change listeners.
 */

const FullscreenEvents = (function () {
    'use strict';

    /**
     * Bind all fullscreen-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const { toggleFullscreen, updateFullscreenState } = handlers;

        // Fullscreen button
        if (elements.fullscreenBtn) {
            elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        // Fullscreen change events
        document.addEventListener('fullscreenchange', updateFullscreenState);
        document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.FullscreenEvents = FullscreenEvents;
}
