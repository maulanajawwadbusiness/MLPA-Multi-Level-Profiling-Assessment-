/**
 * MLPA Prototype - Bind Events Composer
 * 
 * Composes all event modules into a single entry point.
 * This is the only event binding function app.js needs to call.
 */

const BindEvents = (function () {
    'use strict';

    /**
     * Bind all application events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - All event handler functions
     */
    function bindAll(elements, handlers) {
        // Upload events
        if (window.UploadEvents) {
            window.UploadEvents.bind(elements, handlers);
        }

        // Test Mock Data button (special case - not in UploadEvents)
        if (elements.testMockBtn && handlers.handleLoadMock) {
            elements.testMockBtn.addEventListener('click', handlers.handleLoadMock);
        }

        // Sidebar events
        if (window.SidebarEvents) {
            window.SidebarEvents.bind(elements, handlers);
        }

        // Preview events
        if (window.PreviewEvents) {
            window.PreviewEvents.bind(elements, handlers);
        }

        // Questionnaire events
        if (window.QuestionnaireEvents) {
            window.QuestionnaireEvents.bind(elements, handlers);
        }

        // Scale selector events
        if (window.ScaleSelectorEvents) {
            window.ScaleSelectorEvents.bind(elements, handlers);
        }

        // Fullscreen events
        if (window.FullscreenEvents) {
            window.FullscreenEvents.bind(elements, handlers);
        }
    }

    return { bindAll };
})();

if (typeof window !== 'undefined') {
    window.BindEvents = BindEvents;
}
