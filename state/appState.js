/**
 * MLPA Prototype - Application State
 * 
 * Central state object for the application.
 * This is the single source of truth for UI, Preview, and Canvas state.
 * 
 * STATE OWNERSHIP CONTRACT (FROZEN)
 * =================================
 * CATEGORY 1: UI State - Screen navigation, mode flags
 * CATEGORY 2: Preview State - Questionnaire items, answers, progress
 * CATEGORY 3: Canvas State - Graph of scales, positions, connections
 *
 * Scale Object Shape (FROZEN):
 *   scale_id: string
 *   scale_name: string
 *   parent_scale_id: string | null
 *   is_root: boolean
 *   expanded: boolean
 *   depth: number
 *   branch_index?: number
 *   position: { x: number, y: number }
 *   positionLocked?: boolean
 *   dimensions: Dimension[]
 *
 * FlatItem Interface (FROZEN - for preview):
 *   item_id, origin_item_id, text, baseline_rubric, current_rubric, dimension
 */

const AppState = (function () {
    'use strict';

    /**
     * The central application state object.
     */
    const state = {
        // === CATEGORY 1: UI State ===
        currentScreen: 1,
        totalScreens: 3,
        csvData: null,
        csvRaw: null,
        isProcessing: false,
        appActive: false,
        sidebarCollapsed: false,
        previewMode: false,

        // === CATEGORY 2: Preview State ===
        items: [],                   // FlatItem[] - CONTRACT: see above
        currentItemIndex: 0,
        answers: {},                 // item_id → answer (1-5)
        isCompleted: false,
        selectedScaleId: null,

        // === CATEGORY 3: Canvas State ===
        canvasState: {
            scales: new Map(),         // CONTRACT: Map<string, Scale>
            connections: [],           // Visual only, derived from parent_scale_id
            pan: { x: 0, y: 0 },      // Canvas viewport offset
            activeScaleId: 'skala-asli'
        }
    };

    /**
     * Get a shallow copy of the state (for external exposure).
     * @returns {Object} Shallow copy of state
     */
    function getStateCopy() {
        return { ...state };
    }

    return {
        state,
        getStateCopy
    };
})();

if (typeof window !== 'undefined') {
    window.AppState = AppState;
}
