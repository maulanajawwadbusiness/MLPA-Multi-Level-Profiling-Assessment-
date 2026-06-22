/**
 * MLPA Prototype - Canvas Pan/Zoom Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Handle canvas panning interactions
 * Inputs: Canvas element, pan state, callback for transform updates
 * Outputs: Updated pan coordinates
 * Allowed side effects: DOM cursor style changes
 * Forbidden responsibilities:
 *   - NO rendering
 *   - NO scale mutations
 *   - NO business logic
 */

const CanvasPanZoom = (function () {
    'use strict';

    /**
     * Bind panning event handlers to canvas.
     * 
     * @param {Object} options
     * @param {HTMLElement} options.canvas - Canvas element
     * @param {HTMLElement} options.boxesContainer - Flow boxes container
     * @param {Object} options.panState - { x, y } pan offset
     * @param {Function} options.onPan - Callback when pan changes
     */
    function bindPanning(options) {
        const { canvas, boxesContainer, panState, onPan } = options;
        if (!canvas) return;

        let isPanning = false;
        let panStart = { x: 0, y: 0 };

        canvas.addEventListener('mousedown', (e) => {
            // Only pan if clicking on canvas background, not on flow boxes
            if (e.target === canvas || e.target === boxesContainer) {
                isPanning = true;
                panStart = { x: e.clientX - panState.x, y: e.clientY - panState.y };
                canvas.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            panState.x = e.clientX - panStart.x;
            panState.y = e.clientY - panStart.y;
            if (onPan) onPan();
        });

        document.addEventListener('mouseup', () => {
            if (isPanning) {
                isPanning = false;
                canvas.style.cursor = 'grab';
            }
        });
    }

    /**
     * Update canvas world layer transform.
     * 
     * @param {HTMLElement} worldLayer - World layer element
     * @param {Object} panState - { x, y } pan offset
     */
    function updateTransform(worldLayer, panState) {
        if (worldLayer) {
            worldLayer.style.transform = `translate(${panState.x}px, ${panState.y}px)`;
        }
    }

    return {
        bindPanning,
        updateTransform
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.CanvasPanZoom = CanvasPanZoom;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasPanZoom;
}
