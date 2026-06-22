/**
 * MLPA Prototype - Flow Editor Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Main orchestrator for flow editor (Screen 3)
 * Inputs: State, DOM elements, sub-modules
 * Outputs: Rendered flow editor with interactions
 * Allowed side effects: DOM manipulation, state mutation (via sub-modules)
 * 
 * Composes:
 *   - CanvasPanZoom (canvas/panZoom.js)
 *   - CanvasBounds (canvas/bounds.js)
 *   - FlowEditMode (flowbox/flowEditMode.js)
 *   - FlowBranching (flowbox/flowBranching.js)
 *   - FlowExport (flowbox/flowExport.js)
 *   - FlowConnections (connections/flowConnections.js)
 *   - RubricPopup (popups/rubricPopup.js)
 *   - FlowBoxRenderer (ui/renderer/flowBoxRenderer.js)
 */

const FlowEditor = (function () {
    'use strict';

    const DEBUG_FLOW_EDITOR = false;

    // DOM references
    let canvas = null;
    let worldLayer = null;
    let boxesContainer = null;
    let connectionsLayer = null;
    let debugPanel = null;

    // State reference (passed during init)
    let stateRef = null;

    /**
     * Initialize the flow editor.
     * 
     * @param {Object} state - Application state
     */
    function init(state) {
        // Guard: Ensure state is valid
        if (!state || !state.canvasState) {
            console.error('[FlowEditor] Cannot initialize: state or state.canvasState is null');
            return;
        }

        stateRef = state;

        canvas = document.getElementById('flow-canvas');
        worldLayer = document.getElementById('flow-world');
        boxesContainer = document.getElementById('flow-boxes');
        connectionsLayer = document.getElementById('flow-connections');

        if (canvas) {
            // Bind panning via sub-module
            if (window.CanvasPanZoom) {
                window.CanvasPanZoom.bindPanning({
                    canvas,
                    boxesContainer,
                    panState: state.canvasState.pan,
                    onPan: () => updateCanvasTransform()
                });
            }
        }

        // Bind branching popup
        const branchCloseBtn = document.getElementById('branching-popup-close');
        if (branchCloseBtn) {
            branchCloseBtn.addEventListener('click', () => closeBranchingPopup());
        }

        // Bind branching submit button
        const branchSubmitBtn = document.getElementById('branching-submit');
        if (branchSubmitBtn) {
            branchSubmitBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                handleBranchingSubmit();
            });
        }

        // Bind global export
        const exportBtn = document.getElementById('global-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => exportAllScales());
        }

        // Initialize debug panel
        if (DEBUG_FLOW_EDITOR) {
            initDebugPanel();
        }
    }

    /**
     * Update canvas world layer transform.
     */
    function updateCanvasTransform() {
        if (window.CanvasPanZoom && worldLayer && stateRef) {
            window.CanvasPanZoom.updateTransform(worldLayer, stateRef.canvasState.pan);
        }
    }

    /**
     * Update canvas bounds.
     */
    function updateCanvasBounds() {
        if (window.CanvasBounds) {
            window.CanvasBounds.updateBounds({ boxesContainer, canvas });
        }
    }

    /**
     * Render all flow boxes and connections.
     */
    function renderAll() {
        if (!boxesContainer || !stateRef || !stateRef.canvasState) {
            console.warn('[FlowEditor] Cannot render: missing state or DOM elements');
            return;
        }
        boxesContainer.innerHTML = '';

        stateRef.canvasState.scales.forEach((scale) => {
            // Auto-position ONLY if position is undefined AND not locked
            if (!scale.position && !scale.positionLocked && canvas) {
                const canvasHeight = canvas.clientHeight || window.innerHeight;
                const estimatedBoxHeight = 120;
                scale.position = {
                    x: 100,
                    y: (canvasHeight - estimatedBoxHeight) * 0.5
                };
            }

            const flowBoxHtml = createFlowBoxHtml(scale);
            boxesContainer.insertAdjacentHTML('beforeend', flowBoxHtml);
        });

        bindFlowBoxEvents();
        renderConnections();

        // Update debug panel
        if (DEBUG_FLOW_EDITOR) {
            updateDebugPanel();
        }

        // Update virtual canvas bounds
        updateCanvasBounds();
    }

    /**
     * Create flow box HTML (delegated).
     */
    function createFlowBoxHtml(scale) {
        return window.FlowBoxRenderer
            ? window.FlowBoxRenderer.createFlowBoxHtml(scale)
            : '';
    }

    /**
     * Render connections (delegated).
     */
    function renderConnections() {
        if (window.FlowConnections && stateRef) {
            window.FlowConnections.renderConnections({
                scales: stateRef.canvasState.scales,
                connectionsLayer,
                canvas,
                panState: stateRef.canvasState.pan
            });
        }
    }

    /**
     * Bind all flow box event handlers.
     */
    function bindFlowBoxEvents() {
        // Toggle expand/collapse
        document.querySelectorAll('.flow-box-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const flowBox = e.target.closest('.flow-box');
                const scaleId = flowBox.dataset.scaleId;
                const scale = stateRef.canvasState.scales.get(scaleId);
                if (scale) {
                    scale.expanded = !scale.expanded;
                    flowBox.classList.toggle('flow-mode-collapsed', !scale.expanded);
                    setTimeout(() => updateCanvasBounds(), 350);
                }
            });
        });

        // Edit mode toggle
        document.querySelectorAll('.edit-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const flowBox = e.target.closest('.flow-box');
                const scaleId = flowBox.dataset.scaleId;
                const scale = stateRef.canvasState.scales.get(scaleId);
                const isEntering = !flowBox.classList.contains('flow-edit-mode');

                if (isEntering) {
                    // Exit edit mode on any other flow boxes first
                    document.querySelectorAll('.flow-box.flow-edit-mode').forEach(box => {
                        if (window.FlowEditMode) {
                            window.FlowEditMode.confirmOrRevertEdit(stateRef.canvasState);
                        }
                        box.classList.remove('flow-edit-mode');
                    });

                    // Auto-expand if collapsed
                    if (scale && !scale.expanded) {
                        scale.expanded = true;
                        flowBox.classList.remove('flow-mode-collapsed');
                        setTimeout(() => updateCanvasBounds(), 350);
                    }

                    // Enter edit mode
                    flowBox.classList.add('flow-edit-mode');
                    if (window.FlowEditMode) {
                        window.FlowEditMode.showEditTooltip(btn);
                    }
                } else {
                    // Confirm any active edit before exiting
                    if (window.FlowEditMode) {
                        window.FlowEditMode.confirmOrRevertEdit(stateRef.canvasState);
                        window.FlowEditMode.showNotification('Edit item dinonaktifkan');
                    }
                    flowBox.classList.remove('flow-edit-mode');
                }
            });
        });

        // Click handler for edit mode interactions
        document.addEventListener('click', (e) => {
            const clickedItem = e.target.closest('.item-box');
            const activeEditBox = document.querySelector('.flow-box.flow-edit-mode');

            // Handle click on item in edit mode
            if (clickedItem && activeEditBox && activeEditBox.contains(clickedItem)) {
                const activeItem = window.FlowEditMode?.getActiveEditItem();
                if (activeItem && activeItem !== clickedItem) {
                    window.FlowEditMode.confirmOrRevertEdit(stateRef.canvasState);
                }

                if (!clickedItem.classList.contains('item-editing')) {
                    e.stopPropagation();
                    if (window.FlowEditMode) {
                        window.FlowEditMode.startEditItem(clickedItem);
                    }
                }
                return;
            }

            // Click outside active edit item
            const activeItem = window.FlowEditMode?.getActiveEditItem();
            if (activeItem && !activeItem.contains(e.target)) {
                window.FlowEditMode.confirmOrRevertEdit(stateRef.canvasState);
            }

            // Click outside flow box in edit mode
            if (activeEditBox && !activeEditBox.contains(e.target)) {
                activeEditBox.classList.remove('flow-edit-mode');
                if (window.FlowEditMode) {
                    window.FlowEditMode.showNotification('Edit item dinonaktifkan');
                }
            }
        });

        // Branch button
        document.querySelectorAll('.branch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const flowBox = e.target.closest('.flow-box');
                const scaleId = flowBox.dataset.scaleId;
                openBranchingPopup(scaleId);
            });
        });

        // Per-scale export
        document.querySelectorAll('.flow-box-tools .export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const flowBox = e.target.closest('.flow-box');
                const scaleId = flowBox.dataset.scaleId;
                exportScale(scaleId);
            });
        });

        // Delete button
        document.querySelectorAll('.flow-box-tools .delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const flowBox = e.target.closest('.flow-box');
                const scaleId = flowBox.dataset.scaleId;
                handleDeleteScale(scaleId);
            });
        });

        // Bind rubric popup handlers
        if (window.RubricPopup) {
            window.RubricPopup.bindPopupHandlers();
        }
    }

    // ============================================================================
    // BRANCHING
    // ============================================================================

    function openBranchingPopup(scaleId) {
        if (window.FlowBranching && stateRef && stateRef.canvasState) {
            window.FlowBranching.openBranchingPopup(scaleId, stateRef.canvasState, canvas);
        }
    }

    function closeBranchingPopup() {
        if (window.FlowBranching) {
            window.FlowBranching.closeBranchingPopup();
        }
    }

    function handleBranchingSubmit() {
        if (window.FlowBranching && stateRef && stateRef.canvasState) {
            window.FlowBranching.handleBranchingSubmit({
                canvasState: stateRef.canvasState,
                getNextBranchPosition,
                expandWithMockRubrics,
                renderAll
            });
        }
    }

    function getNextBranchPosition(sourceScaleId, branch_index) {
        if (!stateRef || !stateRef.canvasState) {
            console.warn('[FlowEditor] Cannot get branch position: state not initialized');
            return { x: 500, y: 250, depth: 1, branch_index };
        }
        const source = stateRef.canvasState.scales.get(sourceScaleId);
        return window.BranchPositioning
            ? window.BranchPositioning.getNextBranchPosition(source, branch_index)
            : { x: 500, y: 250, depth: 1, branch_index };
    }

    function expandWithMockRubrics(gptDimensions, scaleId, sourceDimensions) {
        return window.OpenAIScaleAdapter
            ? window.OpenAIScaleAdapter.expandWithRubrics(gptDimensions, scaleId, sourceDimensions)
            : gptDimensions;
    }

    // ============================================================================
    // EXPORT
    // ============================================================================

    function exportScale(scaleId) {
        if (window.FlowExport && stateRef) {
            window.FlowExport.exportScale(scaleId, stateRef.canvasState.scales);
        }
    }

    function exportAllScales() {
        if (window.FlowExport && stateRef) {
            window.FlowExport.exportAllScales(stateRef.canvasState.scales);
        }
    }

    // ============================================================================
    // DELETE
    // ============================================================================

    function handleDeleteScale(scaleId) {
        if (!scaleId || !stateRef) return;

        // Prepare deletion
        const prep = window.FlowEditorController
            ? window.FlowEditorController.prepareDelete(scaleId, stateRef.canvasState.scales)
            : { canDelete: false, error: 'controller_not_found' };

        if (!prep.canDelete) {
            if (prep.error === 'root_protected') {
                alert('Skala utama (Root) tidak dapat dihapus.');
            }
            return;
        }

        // Confirmation
        const count = prep.count;
        const message = count > 1
            ? `Apakah Anda yakin ingin menghapus skala ini dan ${count - 1} turunannya?`
            : `Apakah Anda yakin ingin menghapus skala ini?`;

        if (!confirm(message)) return;

        // Close popup first
        closeBranchingPopup();

        // Execute deletion
        if (window.FlowEditorController) {
            window.FlowEditorController.executeDelete(
                prep.toDelete,
                stateRef.canvasState.scales,
                stateRef.canvasState,
                () => renderAll()
            );
        }
    }

    // ============================================================================
    // DEBUG
    // ============================================================================

    function initDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'flow-debug-panel';
        panel.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 24px;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      z-index: 1000;
      line-height: 1.4;
    `;
        document.body.appendChild(panel);
        debugPanel = panel;
    }

    function updateDebugPanel() {
        if (!debugPanel || !stateRef) return;

        const scalesArray = Array.from(stateRef.canvasState.scales.entries());
        let html = '<div style="font-weight: bold; margin-bottom: 8px; color: #4ade80;">DEBUG: state.canvasState.scales</div>';
        html += `<div style="color: #94a3b8; margin-bottom: 8px;">Total scales: ${scalesArray.length}</div>`;

        scalesArray.forEach(([scaleId, scale]) => {
            html += `
        <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
          <div style="color: #60a5fa; font-weight: bold;">${scale.scale_name}</div>
          <div style="color: #94a3b8; font-size: 10px;">ID: ${scaleId}</div>
          <div style="color: #94a3b8; font-size: 10px;">Parent: ${scale.parent_scale_id || 'null (root)'}</div>
          <div style="color: #94a3b8; font-size: 10px;">Position: (${scale.position.x}, ${scale.position.y})</div>
        </div>
      `;
        });

        debugPanel.innerHTML = html;
    }

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    return {
        init,
        renderAll,
        updateCanvasTransform,
        updateCanvasBounds,
        openBranchingPopup,
        closeBranchingPopup,
        handleBranchingSubmit,
        getNextBranchPosition,
        exportScale,
        exportAllScales,
        handleDeleteScale
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.FlowEditor = FlowEditor;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowEditor;
}
