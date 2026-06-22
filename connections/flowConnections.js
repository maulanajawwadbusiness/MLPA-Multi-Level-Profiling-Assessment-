/**
 * MLPA Prototype - Flow Connections Renderer Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Render SVG bezier connections between flow boxes
 * Inputs: Scales Map, connections layer, canvas, pan state
 * Outputs: SVG path elements in connections layer
 * Allowed side effects: DOM manipulation
 * Forbidden responsibilities:
 *   - NO state mutation
 *   - NO layout logic
 *   - NO business logic
 */

const FlowConnections = (function () {
    'use strict';

    /**
     * Render all connections between parent-child scales.
     * 
     * @param {Object} options
     * @param {Map<string, Scale>} options.scales - Scales Map
     * @param {HTMLElement} options.connectionsLayer - SVG connections layer
     * @param {HTMLElement} options.canvas - Canvas element
     * @param {Object} options.panState - { x, y } pan offset
     */
    function renderConnections(options) {
        const { scales, connectionsLayer, canvas, panState } = options;
        if (!connectionsLayer) return;

        connectionsLayer.innerHTML = '';

        // Get canvas offset for screen → world space conversion
        const canvasRect = canvas?.getBoundingClientRect();
        if (!canvasRect) return;

        const panX = panState.x;
        const panY = panState.y;

        // Iterate through scales and draw connections to parents
        scales.forEach((scale) => {
            if (!scale.parent_scale_id) return;  // Skip root scales

            const parentScale = scales.get(scale.parent_scale_id);
            if (!parentScale) return;

            // Get DOM elements
            const parentEl = document.querySelector(`.flow-box[data-scale-id="${scale.parent_scale_id}"]`);
            const childEl = document.querySelector(`.flow-box[data-scale-id="${scale.scale_id}"]`);
            if (!parentEl || !childEl) return;

            // Get bounding rects (screen space)
            const parentRect = parentEl.getBoundingClientRect();
            const childRect = childEl.getBoundingClientRect();

            // Convert to world space (subtract canvas offset and pan)
            const px = parentRect.right - canvasRect.left - panX;
            const py = parentRect.top + parentRect.height / 2 - canvasRect.top - panY;
            const cx = childRect.left - canvasRect.left - panX;
            const cy = childRect.top + childRect.height / 2 - canvasRect.top - panY;

            // Create bezier path
            const path = window.ConnectionGeometry
                ? window.ConnectionGeometry.createBezierPath(px, py, cx, cy)
                : createBezierPathFallback(px, py, cx, cy);

            connectionsLayer.insertAdjacentHTML('beforeend',
                `<path class="flow-connection-line" d="${path}" />`
            );
        });
    }

    /**
     * Fallback bezier path creation.
     * @private
     */
    function createBezierPathFallback(px, py, cx, cy) {
        const dx = Math.abs(cx - px) / 2;
        return `M ${px} ${py} C ${px + dx} ${py}, ${cx - dx} ${cy}, ${cx} ${cy}`;
    }

    return {
        renderConnections
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.FlowConnections = FlowConnections;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowConnections;
}
