/**
 * MLPA Prototype - Sidebar Toggle Control
 * 
 * Handles sidebar collapse/expand functionality.
 */

const SidebarToggle = (function () {
    'use strict';

    /**
     * Toggle sidebar collapsed state.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function toggle(state, elements) {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        elements.sidebar?.classList.toggle('collapsed', state.sidebarCollapsed);

        // Update tooltip text
        if (elements.sidebarToggleTooltip) {
            elements.sidebarToggleTooltip.textContent = state.sidebarCollapsed
                ? 'Tampilkan sidebar'
                : 'Sembunyikan sidebar';
        }
    }

    return { toggle };
})();

if (typeof window !== 'undefined') {
    window.SidebarToggle = SidebarToggle;
}
