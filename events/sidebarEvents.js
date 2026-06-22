/**
 * MLPA Prototype - Sidebar Events Module
 * 
 * Handles sidebar toggle, show button, and navigation item clicks.
 */

const SidebarEvents = (function () {
    'use strict';

    /**
     * Bind all sidebar-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const { toggleSidebar, switchInnerScreen, updateNavActive } = handlers;

        // Sidebar toggle
        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener('click', toggleSidebar);
        }

        // Sidebar show button (when collapsed)
        if (elements.sidebarShowBtn) {
            elements.sidebarShowBtn.addEventListener('click', toggleSidebar);
        }

        // Navigation items
        elements.navItems?.forEach(item => {
            item.addEventListener('click', () => {
                const screenNum = parseInt(item.dataset.screen);
                switchInnerScreen(screenNum);
                updateNavActive(item);
            });
        });
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.SidebarEvents = SidebarEvents;
}
