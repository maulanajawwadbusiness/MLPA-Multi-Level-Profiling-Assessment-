/**
 * MLPA Prototype - Canvas Bounds Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Calculate and apply canvas container bounds
 * Inputs: Flow boxes container, canvas element
 * Outputs: Updated container height
 * Allowed side effects: DOM style changes (height)
 * Forbidden responsibilities:
 *   - NO panning
 *   - NO rendering
 *   - NO scale mutations
 */

const CanvasBounds = (function () {
    'use strict';

    /**
     * Update canvas bounds based on flow box positions.
     * 
     * @param {Object} options
     * @param {HTMLElement} options.boxesContainer - Flow boxes container
     * @param {HTMLElement} options.canvas - Canvas element
     */
    function updateBounds(options) {
        const { boxesContainer, canvas } = options;
        if (!boxesContainer) return;

        let maxBottom = 0;

        document.querySelectorAll('.flow-box').forEach(box => {
            const bottom = box.offsetTop + box.offsetHeight;
            if (bottom > maxBottom) maxBottom = bottom;
        });

        // Add padding buffer (100px)
        const requiredHeight = maxBottom + 100;

        // Ensure minimum height matches viewport
        const minHeight = canvas ? canvas.clientHeight : window.innerHeight;
        const finalHeight = Math.max(requiredHeight, minHeight);

        boxesContainer.style.height = `${finalHeight}px`;
    }

    return {
        updateBounds
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.CanvasBounds = CanvasBounds;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasBounds;
}
