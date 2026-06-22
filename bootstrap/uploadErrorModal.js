/**
 * MLPA Prototype - Upload Error Modal Module
 * 
 * Handles the upload error modal display and interactions.
 */

const UploadErrorModal = (function () {
    'use strict';

    /**
     * Initialize upload error modal event handlers.
     * @param {Function} handleLoadMock - Callback for mock data loading
     */
    function init(handleLoadMock) {
        const mockBtn = document.getElementById('upload-error-mock');
        const closeBtn = document.getElementById('upload-error-close');

        mockBtn?.addEventListener('click', () => {
            hide();
            if (handleLoadMock) handleLoadMock();
        });

        closeBtn?.addEventListener('click', () => {
            hide();
        });
    }

    /**
     * Show the upload error modal with a message.
     * @param {string} message - Error message to display
     */
    function show(message) {
        const modal = document.getElementById('upload-error-modal');
        const messageEl = document.getElementById('upload-error-message');

        if (messageEl) messageEl.textContent = message;
        modal?.classList.remove('hidden');
    }

    /**
     * Hide the upload error modal.
     */
    function hide() {
        const modal = document.getElementById('upload-error-modal');
        modal?.classList.add('hidden');
    }

    return { init, show, hide };
})();

if (typeof window !== 'undefined') {
    window.UploadErrorModal = UploadErrorModal;
}
