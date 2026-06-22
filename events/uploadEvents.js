/**
 * MLPA Prototype - Upload Events Module
 * 
 * Handles upload zone interactions: click, keydown, drag/drop, file input.
 */

const UploadEvents = (function () {
    'use strict';

    let dragCounter = 0;

    /**
     * Bind all upload-related events.
     * @param {Object} elements - Cached DOM elements
     * @param {Object} handlers - Event handler functions
     */
    function bind(elements, handlers) {
        const {
            handleUploadClick,
            handleUploadKeydown,
            handleFileSelect,
            handleFiles,
            clearError
        } = handlers;

        // Upload zone interactions
        if (elements.uploadZone) {
            elements.uploadZone.addEventListener('click', handleUploadClick);
            elements.uploadZone.addEventListener('keydown', handleUploadKeydown);

            elements.uploadZone.addEventListener('dragenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dragCounter++;
                elements.uploadZone.classList.add('drag-over');
                clearError();
            });

            elements.uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });

            elements.uploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dragCounter--;
                if (dragCounter === 0) {
                    elements.uploadZone.classList.remove('drag-over');
                }
            });

            elements.uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dragCounter = 0;
                elements.uploadZone.classList.remove('drag-over');

                const files = e.dataTransfer?.files;
                if (files && files.length > 0) {
                    handleFiles(files);
                }
            });
        }

        // File input change
        if (elements.fileInput) {
            elements.fileInput.addEventListener('change', handleFileSelect);
        }
    }

    return { bind };
})();

if (typeof window !== 'undefined') {
    window.UploadEvents = UploadEvents;
}
