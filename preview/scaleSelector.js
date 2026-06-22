/**
 * MLPA Prototype - Scale Selector & Preview Pipeline
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Scale selection UI and preview state orchestration
 * Inputs: state, elements, scales Map
 * Outputs: Updated DOM, state mutations via passed references
 * Allowed side effects: DOM updates, state mutation (via passed args)
 * Forbidden responsibilities:
 *   - NO direct global state access (receive as argument)
 *   - NO layout math
 *   - NO GPT calls
 */

// ============================================================================
// SCALE SELECTOR MODULE
// ============================================================================

const ScaleSelector = (function () {
    'use strict';

    /**
     * Render the scale selector graph with tree layout.
     * 
     * @param {Object} options - Render options
     * @param {Map<string, Scale>} options.scales - Scales Map
     * @param {Object} options.elements - DOM elements (scaleSelectorNodes, scaleSelectorConnections)
     * @param {string} options.selectedScaleId - Currently selected scale ID
     * @param {Function} options.onSelect - Callback when scale is selected
     */
    function renderGraph(options) {
        const { scales, elements, selectedScaleId, onSelect } = options;

        if (!elements.scaleSelectorNodes || !elements.scaleSelectorConnections) return;

        if (!scales || scales.size === 0) {
            elements.scaleSelectorNodes.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">No scales available</p>';
            elements.scaleSelectorConnections.innerHTML = '';
            return;
        }

        // Build tree structure
        const tree = window.ScaleGraph
            ? window.ScaleGraph.buildScaleTree(scales)
            : buildTreeFallback(scales);

        // Render nodes with tree layout (indentation based on depth)
        let nodesHtml = '';
        let nodeIndex = 0;

        function renderNode(scaleId, depth) {
            const scale = scales.get(scaleId);
            if (!scale) return;

            const isSelected = selectedScaleId === scaleId;
            const indent = depth * 32; // 32px indent per depth level

            nodesHtml += `
        <div class="scale-node ${isSelected ? 'selected' : ''}" 
             data-scale-id="${scaleId}" 
             style="margin-left: ${indent}px;">
          <span class="scale-node-dot"></span>
          <span class="scale-node-name">${scale.scale_name}</span>
          ${depth > 0 ? `<span class="scale-node-depth">Branch</span>` : '<span class="scale-node-depth">Original</span>'}
        </div>
      `;

            nodeIndex++;

            // Render children
            const children = tree.get(scaleId) || [];
            children.forEach(childId => renderNode(childId, depth + 1));
        }

        // Find root nodes (no parent or parent not in scales)
        const roots = [];
        for (const [id, scale] of scales) {
            if (!scale.parent_scale_id || !scales.has(scale.parent_scale_id)) {
                roots.push(id);
            }
        }

        // Render from each root
        roots.forEach(rootId => renderNode(rootId, 0));

        elements.scaleSelectorNodes.innerHTML = nodesHtml;

        // Bind click events to nodes
        elements.scaleSelectorNodes.querySelectorAll('.scale-node').forEach(node => {
            node.addEventListener('click', () => {
                const scaleId = node.dataset.scaleId;
                if (onSelect) onSelect(scaleId);
            });
        });

        // Clear connectors (we use indentation instead)
        elements.scaleSelectorConnections.innerHTML = '';
    }

    /**
     * Fallback tree builder if ScaleGraph not available.
     * @private
     */
    function buildTreeFallback(scales) {
        const tree = new Map();
        for (const [id, scale] of scales) {
            if (scale.parent_scale_id) {
                if (!tree.has(scale.parent_scale_id)) {
                    tree.set(scale.parent_scale_id, []);
                }
                tree.get(scale.parent_scale_id).push(id);
            }
        }
        return tree;
    }

    /**
     * Execute scale selection pipeline.
     * STEP 1: Update selection → STEP 2: Build flat items → STEP 3: Reset state → STEP 4: Render
     * 
     * @param {Object} options - Selection options
     * @param {string} options.scaleId - Scale ID to select
     * @param {Map<string, Scale>} options.scales - Scales Map
     * @param {Object} options.state - Full state object (will be mutated)
     * @param {Object} options.elements - DOM elements
     * @param {Function} options.updateQuestionnaireUI - UI update callback
     * @param {Function} options.closeScaleSelector - Close modal callback
     * @returns {boolean} Success
     */
    function selectScale(options) {
        const { scaleId, scales, state, elements, updateQuestionnaireUI, closeScaleSelector } = options;

        if (!scaleId) return false;

        const scale = scales.get(scaleId);
        if (!scale) {
            console.warn('[ScaleSelector] Scale not found:', scaleId);
            return false;
        }

        console.log('[ScaleSelector] Selecting scale:', scale.scale_name);

        // =========================================================================
        // PREVIEW PIPELINE (Explicit Flow)
        // =========================================================================

        // STEP 1: Update selection state
        state.selectedScaleId = scaleId;

        // STEP 2: Build flat item list (DELEGATED to ScaleTransform)
        state.items = window.ScaleTransform
            ? window.ScaleTransform.flattenScaleItems(scale)
            : flattenItemsFallback(scale);

        // STEP 3: Reset questionnaire state
        state.currentItemIndex = 0;
        state.answers = {};
        state.isCompleted = false;

        // STEP 4: Render UI
        if (elements.scaleSelectorLabel) {
            elements.scaleSelectorLabel.textContent = scale.scale_name;
        }
        elements.completion?.classList.add('hidden');
        elements.questionnaire?.classList.remove('hidden');

        if (updateQuestionnaireUI) updateQuestionnaireUI();

        // Close modal
        if (closeScaleSelector) closeScaleSelector();

        console.log('[ScaleSelector] Scale selected, items loaded:', state.items.length);
        return true;
    }

    /**
     * Fallback item flattening.
     * @private
     */
    function flattenItemsFallback(scale) {
        const items = [];
        if (scale && Array.isArray(scale.dimensions)) {
            scale.dimensions.forEach(dim => {
                if (Array.isArray(dim.items)) {
                    dim.items.forEach(item => {
                        items.push({ ...item, dimension: dim.name });
                    });
                }
            });
        }
        return items;
    }

    /**
     * Get items from scale (pure delegation).
     * 
     * @param {Scale} scale - Scale object
     * @returns {FlatItem[]} Flattened items
     */
    function getScaleItems(scale) {
        return window.ScaleTransform
            ? window.ScaleTransform.flattenScaleItems(scale)
            : flattenItemsFallback(scale);
    }

    // ---------------------------------------------------------------------------
    // PUBLIC API
    // ---------------------------------------------------------------------------
    return {
        renderGraph,
        selectScale,
        getScaleItems
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.ScaleSelector = ScaleSelector;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScaleSelector;
}
