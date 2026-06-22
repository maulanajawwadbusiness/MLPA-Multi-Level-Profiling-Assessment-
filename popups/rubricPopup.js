/**
 * MLPA Prototype - Rubric Popup Portal Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Create/position floating rubric popups
 * Inputs: Item box elements
 * Outputs: Portal popup in document.body
 * Allowed side effects: DOM manipulation
 * Forbidden responsibilities:
 *   - NO state mutation
 *   - NO rendering
 *   - NO business logic
 */

const RubricPopup = (function () {
    'use strict';

    // Active popup reference
    let activePopup = null;

    /**
     * Bind rubric popup hover handlers to item boxes.
     */
    function bindPopupHandlers() {
        document.querySelectorAll('.item-box').forEach(itemBox => {
            itemBox.addEventListener('mouseenter', handleMouseEnter);
            itemBox.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    /**
     * Handle mouse enter on item box.
     */
    function handleMouseEnter(e) {
        const itemBox = e.currentTarget;
        const rubricData = itemBox.querySelector('.rubric-popup');
        if (!rubricData) return;

        // Remove existing popup
        removeActivePopup();

        // Create portal popup in body
        const popup = document.createElement('div');
        popup.className = 'rubric-popup-portal';
        popup.innerHTML = rubricData.innerHTML;
        document.body.appendChild(popup);
        activePopup = popup;

        // Position using getBoundingClientRect
        const positionPopup = () => {
            const rect = itemBox.getBoundingClientRect();
            popup.style.position = 'fixed';
            popup.style.top = `${rect.top + (rect.height / 2)}px`;
            popup.style.left = `${rect.right + 12}px`;
            popup.style.transform = 'translateY(-50%)';
            popup.style.opacity = '1';
            popup.style.visibility = 'visible';
        };

        positionPopup();

        // Update position on scroll
        const updateHandler = () => positionPopup();
        window.addEventListener('scroll', updateHandler, { passive: true });
        itemBox._rubricScrollHandler = updateHandler;
    }

    /**
     * Handle mouse leave on item box.
     */
    function handleMouseLeave(e) {
        const itemBox = e.currentTarget;
        removeActivePopup();
        if (itemBox._rubricScrollHandler) {
            window.removeEventListener('scroll', itemBox._rubricScrollHandler);
            delete itemBox._rubricScrollHandler;
        }
    }

    /**
     * Remove the active popup.
     */
    function removeActivePopup() {
        if (activePopup) {
            activePopup.remove();
            activePopup = null;
        }
    }

    return {
        bindPopupHandlers,
        removeActivePopup
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.RubricPopup = RubricPopup;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RubricPopup;
}
