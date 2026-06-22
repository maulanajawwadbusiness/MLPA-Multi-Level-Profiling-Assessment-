/**
 * MLPA Prototype - Preview Toggle Control
 * 
 * Handles preview mode toggle functionality.
 */

const PreviewToggle = (function () {
    'use strict';

    /**
     * Toggle preview mode.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function toggle(state, elements) {
        state.previewMode = !state.previewMode;
        document.body.classList.toggle('preview-mode', state.previewMode);
        elements.previewToggle?.classList.toggle('active', state.previewMode);
    }

    return { toggle };
})();

if (typeof window !== 'undefined') {
    window.PreviewToggle = PreviewToggle;
}
