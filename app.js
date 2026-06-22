/**
 * MLPA Prototype - Application Logic
 * Main app with sidebar, questionnaire, preview mode, and CSV/OpenAI integration
 */

(function () {
  'use strict';

  // ==================== STATE ====================
  // State is now defined in state/appState.js
  // Import from window.AppState module
  const state = window.AppState ? window.AppState.state : {
    // Fallback state (should never be used in production)
    currentScreen: 1,
    totalScreens: 3,
    csvData: null,
    csvRaw: null,
    isProcessing: false,
    appActive: false,
    sidebarCollapsed: false,
    previewMode: false,
    items: [],
    currentItemIndex: 0,
    answers: {},
    isCompleted: false,
    selectedScaleId: null,
    canvasState: {
      scales: new Map(),
      connections: [],
      pan: { x: 0, y: 0 },
      activeScaleId: 'skala-asli'
    }
  };

  // ==================== DOM ELEMENTS ====================

  const elements = {
    // Welcome screen
    screens: null,
    uploadZone: null,
    fileInput: null,
    fullscreenBtn: null,
    errorMessage: null,
    testMockBtn: null,

    // App container
    appContainer: null,
    sidebar: null,
    sidebarToggle: null,
    navItems: null,
    mainContent: null,

    // Preview toggle
    previewToggle: null,

    // Questionnaire
    questionnaire: null,
    itemCounter: null,
    itemText: null,
    likertDots: null,
    prevBtn: null,
    nextBtn: null,

    // Completion
    completion: null,
    finalScore: null,
    maxScore: null,
    resetBtn: null,

    // Preview return
    previewReturn: null,

    // Inner screens
    innerScreens: null
  };

  // ==================== INITIALIZATION ====================

  function init() {
    // Build handlers object for event binding
    const handlers = {
      // Upload handlers
      handleUploadClick,
      handleUploadKeydown,
      handleFileSelect,
      handleFiles,
      handleLoadMock,
      clearError,

      // Sidebar handlers
      toggleSidebar,
      switchInnerScreen: (screenNum) => {
        if (window.ScreenNav) {
          window.ScreenNav.switchInnerScreen(screenNum, state, elements);
        }
      },
      updateNavActive: (item) => {
        if (window.ScreenNav) {
          window.ScreenNav.updateNavActive(item, elements);
        }
      },

      // Preview handlers
      togglePreviewMode,

      // Questionnaire handlers
      handleLikertSelect,
      goToPrevItem,
      goToNextItem,
      resetQuestionnaire,

      // Scale selector handlers
      openScaleSelector,
      closeScaleSelector,

      // Fullscreen handlers
      toggleFullscreen,
      updateFullscreenState
    };

    // Use InitApp module if available, otherwise fallback
    if (window.InitApp) {
      window.InitApp.init(elements, state, handlers);
    } else {
      // Fallback to inline init
      cacheElements();
      bindEvents();
      initOfflineDetection();
      initUploadErrorModal();
      showScreen(1);
    }
  }

  // ==================== NETWORK RESILIENCE ====================

  function initOfflineDetection() {
    // DELEGATED to bootstrap/offlineOverlay.js
    if (window.OfflineOverlay) {
      window.OfflineOverlay.init();
    }
  }

  function initUploadErrorModal() {
    // DELEGATED to bootstrap/uploadErrorModal.js
    if (window.UploadErrorModal) {
      window.UploadErrorModal.init(handleLoadMock);
    }
  }

  function showUploadErrorModal(message) {
    if (window.UploadErrorModal) {
      window.UploadErrorModal.show(message);
    }
  }

  function hideUploadErrorModal() {
    if (window.UploadErrorModal) {
      window.UploadErrorModal.hide();
    }
  }

  function cacheElements() {
    // DELEGATED to bootstrap/domCache.js
    if (window.DOMCache) {
      window.DOMCache.cacheElements(elements);
    }
  }

  function bindEvents() {
    // DELEGATED to events/bindEvents.js via InitApp
    // This function is kept for fallback compatibility only
    console.warn('[MLPA] bindEvents() fallback called - should use InitApp');
  }

  // ==================== SCREEN NAVIGATION ====================
  // DELEGATED to bootstrap/screenNav.js

  function showScreen(screenNumber) {
    if (window.ScreenNav) {
      window.ScreenNav.showScreen(screenNumber, state, elements);
    }
  }

  function switchInnerScreen(screenNumber) {
    if (window.ScreenNav) {
      window.ScreenNav.switchInnerScreen(screenNumber, state, elements);
    }
  }

  function updateNavActive(activeItem) {
    if (window.ScreenNav) {
      window.ScreenNav.updateNavActive(activeItem, elements);
    }
  }

  // Note: window.goToScreen is set by InitApp module

  // ==================== SIDEBAR ====================
  // DELEGATED to ui/controls/sidebarToggle.js

  function toggleSidebar() {
    if (window.SidebarToggle) {
      window.SidebarToggle.toggle(state, elements);
    }
  }

  // ==================== PREVIEW MODE ====================
  // DELEGATED to ui/controls/previewToggle.js

  function togglePreviewMode() {
    if (window.PreviewToggle) {
      window.PreviewToggle.toggle(state, elements);
    }
  }

  // ==================== UPLOAD HANDLERS ====================

  function handleUploadClick(e) {
    // Don't open file picker if clicking the mock data button
    if (e.target.closest('#test-mock-btn')) {
      return;
    }
    if (!state.isProcessing) {
      clearError();
      elements.fileInput?.click();
    }
  }

  function handleUploadKeydown(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !state.isProcessing) {
      e.preventDefault();
      clearError();
      elements.fileInput?.click();
    }
  }

  // Drag handlers are now inline in events/uploadEvents.js

  function handleFileSelect(e) {
    const files = e.target?.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  }

  // ==================== FILE VALIDATION ====================

  function isCSVFile(file) {
    return file.name.toLowerCase().endsWith('.csv');
  }

  function showError(message) {
    if (elements.errorMessage) {
      elements.errorMessage.textContent = message;
      elements.errorMessage.classList.add('visible');
      elements.uploadZone?.classList.add('has-error');
    }
  }

  function clearError() {
    if (elements.errorMessage) {
      elements.errorMessage.textContent = '';
      elements.errorMessage.classList.remove('visible');
      elements.uploadZone?.classList.remove('has-error');
    }
  }

  // ==================== CSV PARSING ====================
  // Delegated to CSVIngest module (adapters/csvIngest.js)

  function parseCSV(text) {
    // Delegate to pure module function
    return window.CSVIngest.parseCSV(text);
  }

  function parseCSVLine(line, delimiter = ',') {
    // Delegate to pure module function
    return window.CSVIngest.parseCSVLine(line, delimiter);
  }

  // ==================== FILE PROCESSING ====================

  // Upload loading state management
  let uploadLoadingInterval = null;

  function showUploadLoading() {
    const uploadZone = document.getElementById('upload-zone');
    const loadingText = document.getElementById('upload-loading-text');

    uploadZone?.classList.add('processing');

    // Animated dots
    let dotCount = 0;
    if (loadingText) {
      loadingText.textContent = 'Memproses skala.';
      uploadLoadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 3;
        const dots = '.'.repeat(dotCount + 1);
        loadingText.textContent = 'Memproses skala' + dots;
      }, 400);
    }
  }

  function hideUploadLoading() {
    const uploadZone = document.getElementById('upload-zone');
    uploadZone?.classList.remove('processing');

    if (uploadLoadingInterval) {
      clearInterval(uploadLoadingInterval);
      uploadLoadingInterval = null;
    }
  }

  async function handleFiles(files) {
    const file = files[0];

    if (!isCSVFile(file)) {
      showError('Format tidak didukung. Gunakan file CSV.');
      return;
    }

    clearError();
    state.isProcessing = true;
    showUploadLoading();

    try {
      const content = await readFileAsText(file);
      state.csvRaw = content;

      console.log('[MLPA] CSV file loaded:', file.name);

      // Parse CSV to JSON
      const parsed = parseCSV(content);
      state.csvData = parsed;

      console.log('[MLPA] Parsed CSV:', parsed);

      let rootScale;

      // Try GPT structuring if configured
      if (typeof OpenAIAPI !== 'undefined' && OpenAIAPI.isConfigured()) {
        console.log('[MLPA] Calling GPT for scale structuring...');
        const structured = await OpenAIAPI.structureCSVToScale(parsed.items, file.name);
        console.log('[MLPA] GPT structuring result:', structured);

        // Check sanity-check result
        if (structured && structured.is_valid_scale === false) {
          console.warn('[MLPA] CSV rejected - not a valid scale');
          hideUploadLoading();
          const reason = structured.rejection_reason || 'Skala tidak terdeteksi dalam CSV ini.';
          showUploadErrorModal(reason);
          return;
        }

        // Ask user confirmation if GPT needs to group items into dimensions
        if (structured && structured.has_dimensions === false) {
          console.log('[MLPA] CSV has no dimensions - asking user confirmation');
          hideUploadLoading();

          // Show confirmation modal and wait for user decision
          const userConfirmed = await showDimensionConfirmModal();

          if (!userConfirmed) {
            console.log('[MLPA] User declined dimension grouping');
            return; // User cancelled, stay on upload screen
          }

          console.log('[MLPA] User confirmed dimension grouping');
          showUploadLoading(); // Show loading again while we build the scale
        }

        if (structured && structured.dimensions && structured.dimensions.length > 0) {
          rootScale = buildScaleFromGPT(structured, file.name);
        } else {
          console.warn('[MLPA] GPT structuring invalid, using fallback');
          rootScale = createFallbackScale(parsed.items, file.name);
        }
      } else {
        console.log('[MLPA] OpenAI API not configured, using fallback');
        rootScale = createFallbackScale(parsed.items, file.name);
      }

      // Clear existing scales (single CSV policy)
      state.canvasState.scales.clear();

      // Add to scale graph
      state.canvasState.scales.set(rootScale.scale_id, rootScale);
      state.canvasState.activeScaleId = rootScale.scale_id;

      // Initialize preview via selectScale
      selectScale(rootScale.scale_id);

      console.log('[MLPA] Scale created and selected:', rootScale.scale_id);

      // Hide loading before transition
      hideUploadLoading();

      // Transition to main app
      showScreen(2);

    } catch (error) {
      console.error('[MLPA] File processing error:', error);
      hideUploadLoading();

      // Show structured error message in modal
      const errorMessage = error.message || error.type || 'Terjadi kesalahan. Coba lagi.';
      showUploadErrorModal(errorMessage);
    } finally {
      state.isProcessing = false;
    }
  }

  // Show dimension confirmation modal and return promise
  function showDimensionConfirmModal() {
    return new Promise((resolve) => {
      const modal = document.getElementById('dimension-confirm-modal');
      const yesBtn = document.getElementById('dimension-confirm-yes');
      const noBtn = document.getElementById('dimension-confirm-no');

      modal.classList.remove('hidden');

      const handleYes = () => {
        modal.classList.add('hidden');
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
        resolve(true);
      };

      const handleNo = () => {
        modal.classList.add('hidden');
        yesBtn.removeEventListener('click', handleYes);
        noBtn.removeEventListener('click', handleNo);
        resolve(false);
      };

      yesBtn.addEventListener('click', handleYes);
      noBtn.addEventListener('click', handleNo);
    });
  }

  /**
   * Build Scale object from GPT structuring result
   */
  function buildScaleFromGPT(gptResult, filename) {
    return {
      scale_id: 'imported-scale',
      scale_name: gptResult.scale_name || filename.replace(/\.csv$/i, ''),
      parent_scale_id: null,
      is_root: true,
      expanded: false,
      depth: 0,
      position: { x: 100, y: 250 },
      dimensions: gptResult.dimensions.map(dim => ({
        name: dim.name,
        items: dim.items.map((item, i) => ({
          item_id: item.item_id || `imported-${i + 1}`,
          origin_item_id: item.item_id || `imported-${i + 1}`,
          text: item.text,
          baseline_rubric: item.baseline_rubric || [],
          current_rubric: item.baseline_rubric || [],
          dimension: dim.name
        }))
      }))
    };
  }

  /**
   * Create fallback Scale when GPT is unavailable
   */
  function createFallbackScale(parsedItems, filename) {
    const scaleName = filename
      .replace(/\.csv$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase()) || 'Skala Impor';

    return {
      scale_id: 'imported-scale',
      scale_name: scaleName,
      parent_scale_id: null,
      is_root: true,
      expanded: false,
      depth: 0,
      position: { x: 100, y: 250 },
      dimensions: [{
        name: 'Item Impor',
        items: parsedItems.map((item, i) => ({
          item_id: item.item_id || `imported-${i + 1}`,
          origin_item_id: item.item_id || `imported-${i + 1}`,
          text: item.item_text || item.text || Object.values(item).find(v => typeof v === 'string' && v.length > 10) || '',
          baseline_rubric: [],
          current_rubric: [],
          dimension: 'Item Impor'
        }))
      }]
    };
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // ==================== QUESTIONNAIRE ====================
  // DELEGATED to preview/questionnaireUI.js

  function initQuestionnaire() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.init(state, elements);
    }
  }

  function updateQuestionnaireUI() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.updateUI(state, elements);
    }
  }

  function updateLikertUI() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.updateLikertUI(state, elements);
    }
  }

  function updateNavButtons() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.updateNavButtons(state, elements);
    }
  }

  function handleLikertSelect(dot) {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.handleLikertSelect(dot, state, elements, goToNextItem, checkCompletion);
    }
  }

  function goToPrevItem() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.goToPrevItem(state, elements);
    }
  }

  function goToNextItem() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.goToNextItem(state, elements);
    }
  }

  function checkCompletion() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.checkCompletion(state, elements);
    }
  }

  function showCompletion() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.showCompletion(state, elements);
    }
  }

  function resetQuestionnaire() {
    if (window.QuestionnaireUI) {
      window.QuestionnaireUI.reset(state, elements);
    }
  }

  // ==================== SCALE SELECTOR ====================

  function openScaleSelector() {
    if (!elements.scaleSelectorModal) return;

    // Render the graph before opening
    renderScaleSelectorGraph();

    // Open modal
    elements.scaleSelectorModal.classList.add('open');
    elements.scaleSelectorBtn?.classList.add('open');
  }

  function closeScaleSelector() {
    if (!elements.scaleSelectorModal) return;

    elements.scaleSelectorModal.classList.remove('open');
    elements.scaleSelectorBtn?.classList.remove('open');
  }

  // DELEGATED to preview/scaleSelector.js
  function renderScaleSelectorGraph() {
    window.ScaleSelector.renderGraph({
      scales: state.canvasState.scales,
      elements: elements,
      selectedScaleId: state.selectedScaleId,
      onSelect: selectScale
    });
  }

  // DELEGATED to ScaleGraph module (logic/scaleGraph.js)
  function buildScaleTree(scales) {
    return window.ScaleGraph.buildScaleTree(scales);
  }

  // DELEGATED to preview/scaleSelector.js
  function selectScale(scaleId) {
    window.ScaleSelector.selectScale({
      scaleId,
      scales: state.canvasState.scales,
      state,
      elements,
      updateQuestionnaireUI,
      closeScaleSelector
    });
  }

  // DELEGATED to ScaleTransform module (logic/scaleTransform.js)
  function getScaleItems(scale) {
    return window.ScaleTransform.flattenScaleItems(scale);
  }

  // ==================== MOCK DATA ====================
  // DELEGATED to data/mockItems.js

  // Reference to mock data from module
  const MOCK_ITEMS = window.MockData ? window.MockData.MOCK_ITEMS : [];

  // DELEGATED to data/mockItems.js
  function createMockScale() {
    return window.MockData ? window.MockData.createMockScale() : null;
  }

  function handleLoadMock() {
    console.log('[MLPA] Loading mock data for testing...');

    if (!window.MockData) {
      console.error('[MLPA] MockData module not loaded');
      return;
    }

    // 1. Create and set Root Scale
    const rootScale = createMockScale();
    state.canvasState.scales.set(rootScale.scale_id, rootScale);
    state.canvasState.activeScaleId = rootScale.scale_id;

    // Initialize flowEditor (needed for getNextBranchPosition)
    if (typeof flowEditor !== 'undefined') {
      flowEditor.init(state);
    }

    // 2. Create Gen-Z Branch (Branch 1) - Using standard layout logic
    const genzPos = flowEditor.getNextBranchPosition(rootScale.scale_id, 0);
    const itemsGenz = MOCK_ITEMS.filter(i => i.scale_group === 'genz');
    const dimsGenz = [
      { name: 'Kepercayaan Diri & Keberanian', items: itemsGenz.filter(i => i.dimension === 'Kepercayaan Diri & Keberanian') },
      { name: 'Regulasi Emosi & Interaksi', items: itemsGenz.filter(i => i.dimension === 'Regulasi Emosi & Interaksi') },
      { name: 'Optimisme dan Tujuan (Goals)', items: itemsGenz.filter(i => i.dimension === 'Optimisme dan Tujuan (Goals)') }
    ];

    const genzScale = {
      scale_id: 'skala-genz',
      scale_name: 'Skala Gen-Z - Skala Kepercayaan Diri',
      parent_scale_id: rootScale.scale_id,
      is_root: false,
      expanded: false,
      depth: genzPos.depth,
      branch_index: genzPos.branch_index,
      position: { x: genzPos.x, y: genzPos.y },
      positionLocked: true,
      dimensions: dimsGenz
    };
    state.canvasState.scales.set(genzScale.scale_id, genzScale);

    // 3. Create Boomer Branch (Branch 2) - Using standard layout logic
    const boomerPos = flowEditor.getNextBranchPosition(rootScale.scale_id, 1);
    const itemsBoomer = MOCK_ITEMS.filter(i => i.scale_group === 'boomer');
    const dimsBoomer = [
      { name: 'Kepercayaan Diri pada Usia Boomer', items: itemsBoomer.filter(i => i.dimension === 'Kepercayaan Diri pada Usia Boomer') },
      { name: 'Regulasi Emosi dan Interaksi Sosial', items: itemsBoomer.filter(i => i.dimension === 'Regulasi Emosi dan Interaksi Sosial') },
      { name: 'Optimisme dan Makna Hidup', items: itemsBoomer.filter(i => i.dimension === 'Optimisme dan Makna Hidup') }
    ];

    const boomerScale = {
      scale_id: 'skala-boomer',
      scale_name: 'Skala Boomer - Skala Kepercayaan Diri',
      parent_scale_id: rootScale.scale_id,
      is_root: false,
      expanded: false,
      depth: boomerPos.depth,
      branch_index: boomerPos.branch_index,
      position: { x: boomerPos.x, y: boomerPos.y },
      positionLocked: true,
      dimensions: dimsBoomer
    };
    state.canvasState.scales.set(boomerScale.scale_id, boomerScale);

    // Select root scale for preview (this sets items, updates button label, etc.)
    selectScale(rootScale.scale_id);

    console.log('[MLPA] Mock data loaded: Root + 2 Branches');

    // Transition to main app
    showScreen(2);
  }

  // ==================== FLOW EDITOR (Screen 3) ====================
  // DELEGATED to flowbox/flowEditor.js

  // Thin wrapper that delegates to FlowEditor module
  const flowEditor = {
    init(stateParam) {
      if (window.FlowEditor) {
        // Use passed parameter or fall back to closure state
        window.FlowEditor.init(stateParam || state);
      }
    },

    renderAll() {
      if (window.FlowEditor) {
        window.FlowEditor.renderAll();
      }
    },

    getNextBranchPosition(sourceScaleId, branch_index) {
      return window.FlowEditor
        ? window.FlowEditor.getNextBranchPosition(sourceScaleId, branch_index)
        : window.BranchPositioning
          ? window.BranchPositioning.getNextBranchPosition(
            state.canvasState.scales.get(sourceScaleId),
            branch_index
          )
          : { x: 500, y: 250, depth: 1, branch_index };
    },

    closeBranchingPopup() {
      if (window.FlowEditor) {
        window.FlowEditor.closeBranchingPopup();
      }
    }
  };

  // Expose for external use
  window.flowEditor = flowEditor;

  // ==================== FULLSCREEN ====================
  // DELEGATED to ui/fullscreen/fullscreen.js

  function toggleFullscreen() {
    if (window.FullscreenControl) {
      window.FullscreenControl.toggle();
    }
  }

  function updateFullscreenState() {
    if (window.FullscreenControl) {
      window.FullscreenControl.updateState();
    }
  }

  // ==================== START ====================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
