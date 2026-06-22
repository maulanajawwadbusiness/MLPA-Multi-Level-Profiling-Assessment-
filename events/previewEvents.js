/**
 * MLPA Prototype - Preview Events Module
 * 
 * Handles preview mode toggle and return button.
 */

const PreviewEvents = (function () {
    'use strict';

    /**
     * Bind all preview-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const { togglePreviewMode } = handlers;

        // Preview toggle
        if (elements.previewToggle) {
            elements.previewToggle.addEventListener('click', togglePreviewMode);
        }

        // Preview return button
        if (elements.previewReturn) {
            elements.previewReturn.addEventListener('click', togglePreviewMode);
        }
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.PreviewEvents = PreviewEvents;
}
