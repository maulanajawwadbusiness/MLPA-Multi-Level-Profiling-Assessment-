/**
 * MLPA Prototype - Fullscreen Control
 * 
 * Handles fullscreen toggle and state sync with vendor prefixes.
 */

const FullscreenControl = (function () {
    'use strict';

    /**
     * Toggle fullscreen mode.
     */
    function toggle() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    /**
     * Update body class based on fullscreen state.
     */
    function updateState() {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
        document.body.classList.toggle('is-fullscreen', isFullscreen);
    }

    return { toggle, updateState };
})();

if (typeof window !== 'undefined') {
    window.FullscreenControl = FullscreenControl;
}
