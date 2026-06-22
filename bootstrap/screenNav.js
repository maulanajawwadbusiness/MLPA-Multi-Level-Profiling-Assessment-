/**
 * MLPA Prototype - Screen Navigation Module
 * 
 * Handles screen transitions, inner screen switching, and nav state.
 */

const ScreenNav = (function () {
    'use strict';

    /**
     * Show a screen by number.
     * @param {number} screenNumber - Screen to show (1-3)
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function showScreen(screenNumber, state, elements) {
        if (screenNumber < 1 || screenNumber > state.totalScreens) return;

        state.currentScreen = screenNumber;

        // Handle welcome screen
        const welcomeScreen = document.getElementById('screen-1');
        if (screenNumber === 1) {
            welcomeScreen?.classList.add('active');
            elements.appContainer?.classList.remove('active');
            state.appActive = false;
        } else {
            welcomeScreen?.classList.remove('active');
            elements.appContainer?.classList.add('active');
            state.appActive = true;
            switchInnerScreen(screenNumber, state, elements);
        }
    }

    /**
     * Switch to an inner screen (2 or 3).
     * @param {number} screenNumber - Inner screen to show
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function switchInnerScreen(screenNumber, state, elements) {
        elements.innerScreens?.forEach((screen, index) => {
            const isActive = index + 2 === screenNumber;
            screen.classList.toggle('active', isActive);
        });
        state.currentScreen = screenNumber;

        // Initialize flow editor when switching to screen 3
        if (screenNumber === 3 && window.FlowEditor) {
            window.FlowEditor.init(state);
            window.FlowEditor.renderAll();
        }
    }

    /**
     * Update navigation item active state.
     * @param {HTMLElement} activeItem - The active nav item
     * @param {Object} elements - Cached DOM elements
     */
    function updateNavActive(activeItem, elements) {
        elements.navItems?.forEach(item => item.classList.remove('active'));
        activeItem?.classList.add('active');
    }

    return { showScreen, switchInnerScreen, updateNavActive };
})();

if (typeof window !== 'undefined') {
    window.ScreenNav = ScreenNav;
    // Expose for external use
    window.goToScreen = null; // Will be set by initApp
}
