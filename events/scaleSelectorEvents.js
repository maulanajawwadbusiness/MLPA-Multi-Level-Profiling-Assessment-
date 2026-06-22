/**
 * MLPA Prototype - Scale Selector Events Module
 * 
 * Handles scale selector modal open/close, backdrop, and escape key.
 */

const ScaleSelectorEvents = (function () {
    'use strict';

    /**
     * Bind all scale selector-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const { openScaleSelector, closeScaleSelector } = handlers;

        // Scale selector button
        if (elements.scaleSelectorBtn) {
            elements.scaleSelectorBtn.addEventListener('click', openScaleSelector);
        }

        // Close button
        if (elements.scaleSelectorClose) {
            elements.scaleSelectorClose.addEventListener('click', closeScaleSelector);
        }

        // Backdrop click
        if (elements.scaleSelectorBackdrop) {
            elements.scaleSelectorBackdrop.addEventListener('click', closeScaleSelector);
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.scaleSelectorModal?.classList.contains('open')) {
                closeScaleSelector();
            }
        });
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.ScaleSelectorEvents = ScaleSelectorEvents;
}
