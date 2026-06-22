/**
 * MLPA Prototype - Questionnaire UI Module
 * 
 * Handles questionnaire rendering, navigation, and user interactions.
 */

const QuestionnaireUI = (function () {
    'use strict';

    /**
     * Initialize questionnaire state.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function init(state, elements) {
        state.currentItemIndex = 0;
        state.answers = {};
        state.isCompleted = false;

        // Show questionnaire, hide completion
        elements.questionnaire?.classList.remove('hidden');
        elements.completion?.classList.add('hidden');

        updateUI(state, elements);
    }

    /**
     * Update questionnaire UI with current item.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function updateUI(state, elements) {
        if (!state.items || state.items.length === 0) {
            if (elements.itemText) {
                elements.itemText.textContent = 'No items to display';
            }
            return;
        }

        const item = state.items[state.currentItemIndex];
        const total = state.items.length;

        // Update counter
        if (elements.itemCounter) {
            elements.itemCounter.textContent = `Item ${state.currentItemIndex + 1} / ${total}`;
        }

        // Update item text - try common column names
        const textValue = item.item_text || item.text || item.question || item.statement || item.pernyataan ||
            Object.values(item).find(v => typeof v === 'string' && v.length > 10) ||
            Object.values(item)[1] || 'No text available';

        if (elements.itemText) {
            elements.itemText.textContent = textValue;
        }

        // Update Likert selection state
        updateLikertUI(state, elements);

        // Update navigation buttons
        updateNavButtons(state, elements);
    }

    /**
     * Update Likert dot selection state.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function updateLikertUI(state, elements) {
        const currentAnswer = state.answers[state.currentItemIndex];

        elements.likertDots?.forEach(dot => {
            const value = parseInt(dot.dataset.value);
            dot.classList.toggle('selected', value === currentAnswer);
        });
    }

    /**
     * Update navigation button states.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function updateNavButtons(state, elements) {
        if (elements.prevBtn) {
            elements.prevBtn.disabled = state.currentItemIndex === 0;
        }
        if (elements.nextBtn) {
            elements.nextBtn.disabled = state.currentItemIndex >= state.items.length - 1;
        }
    }

    /**
     * Handle Likert dot selection.
     * @param {HTMLElement} dot - Clicked dot element
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     * @param {Function} goToNextItem - Function to go to next item
     * @param {Function} checkCompletion - Function to check completion
     */
    function handleLikertSelect(dot, state, elements, goToNextItem, checkCompletion) {
        const value = parseInt(dot.dataset.value);
        state.answers[state.currentItemIndex] = value;

        console.log('[MLPA] Answer recorded:', state.currentItemIndex + 1, '=', value);

        // Update UI
        updateLikertUI(state, elements);

        // Auto-advance after brief delay
        setTimeout(() => {
            if (state.currentItemIndex < state.items.length - 1) {
                goToNextItem();
            } else {
                // Check if all items answered
                checkCompletion();
            }
        }, 300);
    }

    /**
     * Go to previous item.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function goToPrevItem(state, elements) {
        if (state.currentItemIndex > 0) {
            state.currentItemIndex--;
            updateUI(state, elements);
        }
    }

    /**
     * Go to next item.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function goToNextItem(state, elements) {
        if (state.currentItemIndex < state.items.length - 1) {
            state.currentItemIndex++;
            updateUI(state, elements);
        }
    }

    /**
     * Check if questionnaire is complete.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function checkCompletion(state, elements) {
        const answeredCount = Object.keys(state.answers).length;
        const totalItems = state.items.length;

        if (answeredCount >= totalItems) {
            showCompletion(state, elements);
        }
    }

    /**
     * Show completion screen.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function showCompletion(state, elements) {
        state.isCompleted = true;

        // Calculate total score (sum of all answers)
        const answers = Object.values(state.answers);
        const totalScore = answers.reduce((a, b) => a + b, 0);
        const maxScore = state.items.length * 5; // 5 is max Likert value

        if (elements.finalScore) {
            elements.finalScore.textContent = totalScore;
        }
        if (elements.maxScore) {
            elements.maxScore.textContent = maxScore;
        }

        // Show completion, hide questionnaire
        elements.questionnaire?.classList.add('hidden');
        elements.completion?.classList.remove('hidden');

        console.log('[MLPA] Questionnaire completed. Score:', totalScore, '/', maxScore);
    }

    /**
     * Reset questionnaire to initial state.
     * @param {Object} state - Application state
     * @param {Object} elements - Cached DOM elements
     */
    function reset(state, elements) {
        console.log('[MLPA] Resetting questionnaire...');

        // Reset state
        state.currentItemIndex = 0;
        state.answers = {};
        state.isCompleted = false;

        // Hide completion, show questionnaire
        elements.completion?.classList.add('hidden');
        elements.questionnaire?.classList.remove('hidden');

        // Update UI
        updateUI(state, elements);

        console.log('[MLPA] Questionnaire reset complete');
    }

    return {
        init,
        updateUI,
        updateLikertUI,
        updateNavButtons,
        handleLikertSelect,
        goToPrevItem,
        goToNextItem,
        checkCompletion,
        showCompletion,
        reset
    };
})();

if (typeof window !== 'undefined') {
    window.QuestionnaireUI = QuestionnaireUI;
}
