/**
 * MLPA Prototype - DOM Cache Module
 * 
 * Caches all DOM element references used by the application.
 * Returns an elements object with all required keys.
 */

const DOMCache = (function () {
    'use strict';

    /**
     * Cache all DOM elements.
     * @param {Object} elements - Elements object to populate
     */
    function cacheElements(elements) {
        // Welcome screen
        elements.screens = document.querySelectorAll('.screen');
        elements.uploadZone = document.getElementById('upload-zone');
        elements.fileInput = document.getElementById('file-input');
        elements.fullscreenBtn = document.getElementById('fullscreen-btn');
        elements.errorMessage = document.getElementById('error-message');
        elements.testMockBtn = document.getElementById('test-mock-btn');

        // App container
        elements.appContainer = document.getElementById('app-container');
        elements.sidebar = document.getElementById('sidebar');
        elements.sidebarToggle = document.getElementById('sidebar-toggle');
        elements.sidebarToggleTooltip = document.querySelector('.sidebar-toggle-tooltip');
        elements.sidebarShowBtn = document.getElementById('sidebar-show-btn');
        elements.navItems = document.querySelectorAll('.nav-item');
        elements.mainContent = document.getElementById('main-content');

        // Preview toggle
        elements.previewToggle = document.getElementById('preview-toggle');

        // Questionnaire
        elements.questionnaire = document.getElementById('questionnaire');
        elements.itemCounter = document.getElementById('item-counter');
        elements.itemText = document.getElementById('item-text');
        elements.likertDots = document.querySelectorAll('.likert-dot');
        elements.prevBtn = document.getElementById('prev-btn');
        elements.nextBtn = document.getElementById('next-btn');

        // Completion
        elements.completion = document.getElementById('completion');
        elements.finalScore = document.getElementById('final-score');
        elements.maxScore = document.getElementById('max-score');
        elements.resetBtn = document.getElementById('reset-btn');

        // Preview return button
        elements.previewReturn = document.getElementById('preview-return');

        // Scale selector
        elements.scaleSelectorBtn = document.getElementById('scale-selector-btn');
        elements.scaleSelectorLabel = document.getElementById('scale-selector-label');
        elements.scaleSelectorModal = document.getElementById('scale-selector-modal');
        elements.scaleSelectorClose = document.getElementById('scale-selector-close');
        elements.scaleSelectorBackdrop = document.querySelector('.scale-selector-backdrop');
        elements.scaleSelectorNodes = document.getElementById('scale-selector-nodes');
        elements.scaleSelectorConnections = document.getElementById('scale-selector-connections');

        // Inner screens
        elements.innerScreens = document.querySelectorAll('.inner-screen');
    }

    return { cacheElements };
})();

if (typeof window !== 'undefined') {
    window.DOMCache = DOMCache;
}
