/**
 * MLPA Prototype - State Mutations
 * 
 * Small, centralized state mutations for UI state changes.
 * These are minimal wrappers for common state updates.
 */

const StateMutations = (function () {
    'use strict';

    /**
     * Set the current screen.
     * @param {Object} state - Application state
     * @param {number} screenNumber - Screen number
     */
    function setCurrentScreen(state, screenNumber) {
        state.currentScreen = screenNumber;
    }

    /**
     * Set preview mode.
     * @param {Object} state - Application state
     * @param {boolean} isActive - Whether preview mode is active
     */
    function setPreviewMode(state, isActive) {
        state.previewMode = isActive;
    }

    /**
     * Set sidebar collapsed state.
     * @param {Object} state - Application state
     * @param {boolean} isCollapsed - Whether sidebar is collapsed
     */
    function setSidebarCollapsed(state, isCollapsed) {
        state.sidebarCollapsed = isCollapsed;
    }

    /**
     * Set app active state.
     * @param {Object} state - Application state
     * @param {boolean} isActive - Whether app is active
     */
    function setAppActive(state, isActive) {
        state.appActive = isActive;
    }

    /**
     * Set processing state.
     * @param {Object} state - Application state
     * @param {boolean} isProcessing - Whether processing is in progress
     */
    function setProcessing(state, isProcessing) {
        state.isProcessing = isProcessing;
    }

    /**
     * Set selected scale ID.
     * @param {Object} state - Application state
     * @param {string|null} scaleId - Selected scale ID
     */
    function setSelectedScaleId(state, scaleId) {
        state.selectedScaleId = scaleId;
    }

    /**
     * Set current item index.
     * @param {Object} state - Application state
     * @param {number} index - Current item index
     */
    function setCurrentItemIndex(state, index) {
        state.currentItemIndex = index;
    }

    /**
     * Set completion state.
     * @param {Object} state - Application state
     * @param {boolean} isCompleted - Whether questionnaire is completed
     */
    function setCompleted(state, isCompleted) {
        state.isCompleted = isCompleted;
    }

    return {
        setCurrentScreen,
        setPreviewMode,
        setSidebarCollapsed,
        setAppActive,
        setProcessing,
        setSelectedScaleId,
        setCurrentItemIndex,
        setCompleted
    };
})();

if (typeof window !== 'undefined') {
    window.StateMutations = StateMutations;
}
