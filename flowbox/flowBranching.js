/**
 * MLPA Prototype - Flow Branching Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Branching popup and GPT branching logic
 * Inputs: State, DOM elements, GPT API
 * Outputs: New scale in state
 * Allowed side effects: State mutation, API calls, DOM updates
 * Forbidden responsibilities:
 *   - NO rendering (delegate to caller)
 *   - NO panning
 *   - NO export
 */

const FlowBranching = (function () {
    'use strict';

    // Loading animation state
    let loadingDotsInterval = null;

    /**
     * Open branching popup.
     * 
     * @param {string} scaleId - Scale ID to branch from
     * @param {Object} canvasState - Canvas state (for branchingFromScaleId)
     * @param {HTMLElement} canvas - Canvas element
     */
    function openBranchingPopup(scaleId, canvasState, canvas) {
        canvasState.branchingFromScaleId = scaleId;
        const popup = document.getElementById('branching-popup');
        if (!popup) return;

        // Get the flow box DOM element for accurate dimensions
        const flowBox = document.querySelector(`.flow-box[data-scale-id="${scaleId}"]`);

        if (flowBox && canvas) {
            const flowBoxRect = flowBox.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const panX = canvasState.pan.x;
            const panY = canvasState.pan.y;

            // Convert screen coords to world coords
            const worldRight = flowBoxRect.right - canvasRect.left - panX;
            const worldCenterY = flowBoxRect.top + flowBoxRect.height / 2 - canvasRect.top - panY;

            // Position popup to the right of flow box in world space
            popup.style.left = `${worldRight + 16}px`;
            popup.style.top = `${worldCenterY}px`;
            popup.style.transform = 'translateY(-50%)';
        }

        popup.classList.remove('hidden');
    }

    /**
     * Close branching popup.
     */
    function closeBranchingPopup() {
        const popup = document.getElementById('branching-popup');
        popup?.classList.add('hidden');
        const input = document.getElementById('branching-input');
        if (input) input.value = '';

        // Stop loading animation if popup closed during processing
        stopLoadingDots();

        // Reset button state
        const submitBtn = document.getElementById('branching-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = 'Create New Branch';
        }
    }

    /**
     * Validate GPT response has required fields (V2).
     * 
     * @param {Object} gptResult - GPT response
     * @param {Object} sourceScale - Source scale for comparison
     * @returns {{ valid: boolean, error?: string }}
     */
    function validateGptScale(gptResult, sourceScale) {
        if (!gptResult) return { valid: false, error: 'No response' };
        if (gptResult.error) return { valid: false, error: gptResult.error };
        if (!gptResult.scale_name || typeof gptResult.scale_name !== 'string') {
            return { valid: false, error: 'Missing scale_name' };
        }
        if (!Array.isArray(gptResult.dimensions) || gptResult.dimensions.length === 0) {
            return { valid: false, error: 'Missing or empty dimensions' };
        }

        // V2: Validate items
        for (let i = 0; i < gptResult.dimensions.length; i++) {
            const dim = gptResult.dimensions[i];
            if (!dim.name || typeof dim.name !== 'string') {
                return { valid: false, error: `Dimension ${i + 1} missing name` };
            }
            if (!Array.isArray(dim.items) || dim.items.length === 0) {
                return { valid: false, error: `Dimension "${dim.name}" has no items` };
            }
            for (let j = 0; j < dim.items.length; j++) {
                const item = dim.items[j];
                if (!item.text || typeof item.text !== 'string') {
                    return { valid: false, error: `Item ${j + 1} in "${dim.name}" missing text` };
                }
            }
        }

        // Safety warnings
        if (sourceScale) {
            if (gptResult.dimensions.length !== sourceScale.dimensions.length) {
                console.warn(
                    `[MLPA Safety] Dimension count mismatch: ` +
                    `expected=${sourceScale.dimensions.length}, got=${gptResult.dimensions.length}`
                );
            }

            for (let i = 0; i < Math.min(gptResult.dimensions.length, sourceScale.dimensions.length); i++) {
                const gptDim = gptResult.dimensions[i];
                const sourceDim = sourceScale.dimensions[i];
                if (gptDim.items.length !== sourceDim.items.length) {
                    console.warn(
                        `[MLPA Safety] Item count mismatch in dimension "${gptDim.name}": ` +
                        `expected=${sourceDim.items.length}, got=${gptDim.items.length}`
                    );
                }
            }
        }

        return { valid: true };
    }

    /**
     * Show branching error notification.
     * 
     * @param {string} message - Error message
     */
    function showBranchingError(message) {
        console.error('[MLPA Branching]', message);
        alert('Failed to create branch: ' + message);
    }

    /**
     * Start animated loading dots on button.
     * 
     * @param {HTMLElement} button - Submit button
     * @param {string} baseText - Base text without dots
     */
    function startLoadingDots(button, baseText = 'Processing') {
        stopLoadingDots();

        let dotCount = 0;
        const spanElement = button.querySelector('span');

        // Immediate update
        spanElement.textContent = baseText + '.';

        // Start interval
        loadingDotsInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 3;
            const dots = '.'.repeat(dotCount + 1);
            spanElement.textContent = baseText + dots;
        }, 400);
    }

    /**
     * Stop loading dots animation.
     */
    function stopLoadingDots() {
        if (loadingDotsInterval) {
            clearInterval(loadingDotsInterval);
            loadingDotsInterval = null;
        }
    }

    /**
     * Handle branching submit.
     * 
     * @param {Object} options
     * @param {Object} options.canvasState - Canvas state
     * @param {Function} options.getNextBranchPosition - Position calculator
     * @param {Function} options.expandWithMockRubrics - Rubric expander
     * @param {Function} options.renderAll - Render callback
     */
    async function handleBranchingSubmit(options) {
        const { canvasState, getNextBranchPosition, expandWithMockRubrics, renderAll } = options;

        // Guard: prevent double-submission
        if (canvasState.isBranchingInProgress) {
            console.log('[MLPA Branching] Already in progress - ignoring');
            return;
        }

        // Get input
        const input = document.getElementById('branching-input');
        const submitBtn = document.getElementById('branching-submit');
        const adaptationIntent = input?.value?.trim();

        // Guard: empty input
        if (!adaptationIntent) {
            console.log('[MLPA Branching] Empty input - doing nothing');
            return;
        }

        // Get source scale
        const sourceScaleId = canvasState.branchingFromScaleId;
        const sourceScale = canvasState.scales.get(sourceScaleId);

        if (!sourceScale) {
            console.error('[MLPA Branching] Source scale not found');
            return;
        }

        // Set lock
        canvasState.isBranchingInProgress = true;

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            startLoadingDots(submitBtn, 'Processing');
        }

        try {
            // Call GPT
            console.log('[MLPA Branching] Calling GPT for adaptation...');
            const gptResult = await OpenAIAPI.adaptScale(sourceScale.scale_name, sourceScale.dimensions, adaptationIntent);

            // Validate
            const validation = validateGptScale(gptResult, sourceScale);
            if (!validation.valid) {
                showBranchingError(validation.error);
                return;
            }

            // Generate unique branch ID
            const branchCount = Array.from(canvasState.scales.keys())
                .filter(id => id.startsWith(sourceScaleId + '-branch')).length + 1;
            const newScaleId = `${sourceScaleId}-branch-${branchCount}`;
            const branch_index = branchCount - 1;

            // Compute position
            const newPosition = getNextBranchPosition(sourceScaleId, branch_index);

            // Expand rubrics
            const fullDimensions = expandWithMockRubrics(gptResult.dimensions, newScaleId, sourceScale.dimensions);

            // Assemble final scale
            const newScale = {
                scale_id: newScaleId,
                scale_name: gptResult.scale_name,
                parent_scale_id: sourceScaleId,
                is_root: false,
                expanded: false,
                depth: newPosition.depth,
                branch_index: newPosition.branch_index,
                position: { x: newPosition.x, y: newPosition.y },
                positionLocked: true,
                dimensions: fullDimensions
            };

            // Add to state
            canvasState.scales.set(newScaleId, newScale);

            // Close popup
            closeBranchingPopup();

            // Re-render
            if (renderAll) renderAll();

            console.log('[MLPA Branching] Branch created successfully:', newScaleId);

        } catch (error) {
            console.error('[MLPA Branching] Error:', error);
            const errorMessage = error.message || error.type || 'An error occurred. Try again.';
            showBranchingError(errorMessage);
        } finally {
            // Release lock
            canvasState.isBranchingInProgress = false;

            // Reset button state
            if (submitBtn) {
                stopLoadingDots();
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Create New Branch';
            }
        }
    }

    return {
        openBranchingPopup,
        closeBranchingPopup,
        validateGptScale,
        showBranchingError,
        startLoadingDots,
        stopLoadingDots,
        handleBranchingSubmit
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.FlowBranching = FlowBranching;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowBranching;
}
