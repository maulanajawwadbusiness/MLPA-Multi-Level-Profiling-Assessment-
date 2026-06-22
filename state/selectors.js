/**
 * MLPA Prototype - State Selectors
 * 
 * Read-only getters for accessing state properties.
 * Provides a clean API for accessing nested state.
 */

const StateSelectors = (function () {
    'use strict';

    /**
     * Get the canvas state.
     * @param {Object} state - Application state
     * @returns {Object} Canvas state
     */
    function getCanvasState(state) {
        return state.canvasState;
    }

    /**
     * Get the scales map.
     * @param {Object} state - Application state
     * @returns {Map} Scales map
     */
    function getScales(state) {
        return state.canvasState?.scales;
    }

    /**
     * Get the selected scale ID.
     * @param {Object} state - Application state
     * @returns {string|null} Selected scale ID
     */
    function getSelectedScaleId(state) {
        return state.selectedScaleId;
    }

    /**
     * Get the preview items.
     * @param {Object} state - Application state
     * @returns {Array} Preview items
     */
    function getPreviewItems(state) {
        return state.items;
    }

    /**
     * Get the current screen number.
     * @param {Object} state - Application state
     * @returns {number} Current screen
     */
    function getCurrentScreen(state) {
        return state.currentScreen;
    }

    /**
     * Get the active scale ID from canvas state.
     * @param {Object} state - Application state
     * @returns {string} Active scale ID
     */
    function getActiveScaleId(state) {
        return state.canvasState?.activeScaleId;
    }

    /**
     * Get the pan offset.
     * @param {Object} state - Application state
     * @returns {Object} Pan offset {x, y}
     */
    function getPan(state) {
        return state.canvasState?.pan;
    }

    return {
        getCanvasState,
        getScales,
        getSelectedScaleId,
        getPreviewItems,
        getCurrentScreen,
        getActiveScaleId,
        getPan
    };
})();

if (typeof window !== 'undefined') {
    window.StateSelectors = StateSelectors;
}
