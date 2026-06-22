/**
 * MLPA Prototype - Questionnaire Events Module
 * 
 * Handles Likert dot clicks, prev/next navigation, and reset button.
 */

const QuestionnaireEvents = (function () {
    'use strict';

    /**
     * Bind all questionnaire-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const { handleLikertSelect, goToPrevItem, goToNextItem, resetQuestionnaire } = handlers;

        // Likert dots
        elements.likertDots?.forEach(dot => {
            dot.addEventListener('click', () => handleLikertSelect(dot));
        });

        // Navigation arrows
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', goToPrevItem);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', goToNextItem);
        }

        // Reset button
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', resetQuestionnaire);
        }
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.QuestionnaireEvents = QuestionnaireEvents;
}
