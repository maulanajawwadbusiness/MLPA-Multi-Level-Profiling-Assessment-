/**
 * MLPA Prototype - Flow Edit Mode Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Item editing interactions (contenteditable)
 * Inputs: State object, DOM elements
 * Outputs: Updated item text in state
 * Allowed side effects: DOM manipulation, state mutation
 * Forbidden responsibilities:
 *   - NO rendering
 *   - NO branching logic
 *   - NO export logic
 */

const FlowEditMode = (function () {
    'use strict';

    // Module state
    let activeEditItem = null;
    let editBackupText = '';

    /**
     * Start editing an item.
     * 
     * @param {HTMLElement} itemBox - Item container element
     */
    function startEditItem(itemBox) {
        const flowBox = itemBox.closest('.flow-box');
        if (!flowBox || !flowBox.classList.contains('flow-edit-mode')) return;

        const itemContent = itemBox.querySelector('.item-content');
        if (!itemContent) return;

        // Store backup
        editBackupText = itemContent.textContent;
        activeEditItem = itemBox;

        // Enter editing state
        itemBox.classList.add('item-editing');
        itemContent.contentEditable = 'true';
        itemContent.focus();

        // Move cursor to end
        const range = document.createRange();
        range.selectNodeContents(itemContent);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        // Add keyboard handlers
        itemContent.addEventListener('keydown', handleEditKeydown);
        itemContent.addEventListener('paste', handleEditPaste);
    }

    /**
     * Handle keydown during edit.
     */
    function handleEditKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmOrRevertEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelActiveEdit();
        }
    }

    /**
     * Handle paste during edit (clean text).
     */
    function handleEditPaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        // Insert plain text only, collapse newlines to spaces
        const cleanText = text.replace(/[\r\n]+/g, ' ').trim();
        document.execCommand('insertText', false, cleanText);
    }

    /**
     * Confirm or revert the active edit.
     * 
     * @param {Object} canvasState - Canvas state for scale updates (optional)
     */
    function confirmOrRevertEdit(canvasState) {
        if (!activeEditItem) return;

        const itemContent = activeEditItem.querySelector('.item-content');
        if (!itemContent) {
            cancelActiveEdit();
            return;
        }

        const newText = itemContent.textContent.trim();
        const isDirty = newText !== editBackupText;

        if (isDirty && newText.length > 0 && canvasState) {
            // Update state first
            const flowBox = activeEditItem.closest('.flow-box');
            const scaleId = flowBox.dataset.scaleId;
            const itemId = activeEditItem.dataset.itemId;
            const scale = canvasState.scales.get(scaleId);

            if (scale) {
                for (const dim of scale.dimensions || []) {
                    for (const it of dim.items || []) {
                        if (it.item_id === itemId) {
                            it.text = newText;
                            break;
                        }
                    }
                }
            }

            // Update DOM second
            itemContent.textContent = newText;
        } else if (isDirty && newText.length === 0) {
            // Dirty but empty → revert
            itemContent.textContent = editBackupText;
        }

        // Exit editing state
        itemContent.contentEditable = 'false';
        itemContent.removeEventListener('keydown', handleEditKeydown);
        itemContent.removeEventListener('paste', handleEditPaste);
        activeEditItem.classList.remove('item-editing');
        activeEditItem = null;
        editBackupText = '';
    }

    /**
     * Cancel active edit and revert.
     */
    function cancelActiveEdit() {
        if (!activeEditItem) return;

        const itemContent = activeEditItem.querySelector('.item-content');
        if (itemContent) {
            // Restore backup
            itemContent.textContent = editBackupText;
            itemContent.contentEditable = 'false';
            itemContent.removeEventListener('keydown', handleEditKeydown);
            itemContent.removeEventListener('paste', handleEditPaste);
        }

        // Exit editing state
        activeEditItem.classList.remove('item-editing');
        activeEditItem = null;
        editBackupText = '';
    }

    /**
     * Show edit tooltip near button.
     * 
     * @param {HTMLElement} button - Button to position near
     */
    function showEditTooltip(button) {
        // Remove any existing tooltip
        const existingTooltip = document.querySelector('.edit-mode-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'edit-mode-tooltip';
        tooltip.textContent = 'Click item to edit text';
        document.body.appendChild(tooltip);

        // Position above button (left-leaning)
        const rect = button.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.right}px`;
        tooltip.style.top = `${rect.top - 6}px`;
        tooltip.style.transform = 'translate(-100%, -100%)';

        // Trigger animation by adding active class after paint
        requestAnimationFrame(() => {
            tooltip.classList.add('active');
        });

        // Auto-remove after 1.5 seconds
        setTimeout(() => {
            tooltip.classList.remove('active');
            setTimeout(() => tooltip.remove(), 150);
        }, 1500);
    }

    /**
     * Show notification toast.
     * 
     * @param {string} message - Message to display
     */
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'edit-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-remove after 1.5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 400);
        }, 1500);
    }

    /**
     * Get active edit item.
     */
    function getActiveEditItem() {
        return activeEditItem;
    }

    return {
        startEditItem,
        confirmOrRevertEdit,
        cancelActiveEdit,
        showEditTooltip,
        showNotification,
        getActiveEditItem
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.FlowEditMode = FlowEditMode;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowEditMode;
}
