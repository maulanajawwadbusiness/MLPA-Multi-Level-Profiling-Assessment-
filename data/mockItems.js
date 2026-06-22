/**
 * MLPA Prototype - Mock Items Data
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Provide mock psychometric scale data for testing
 * Inputs: None
 * Outputs: MOCK_ITEMS array, createMockScale function
 * Allowed side effects: NONE (pure data)
 * Forbidden responsibilities:
 *   - NO state mutation
 *   - NO DOM access
 *   - NO business logic beyond data structuring
 */

// ============================================================================
// MOCK ITEMS DATA
// ============================================================================
// 30 items across 3 scale groups (Asli, Gen-Z, Boomer)
// Each with dual rubric tracking (baseline_rubric, current_rubric)

const MOCK_ITEMS = [
    // === SKALA ASLI ===
    // Dimension 1: Kepercayaan Diri (items 1-3)
    {
        item_id: '1',
        origin_item_id: '1',
        text: 'Saya merasa percaya diri dalam menghadapi tantangan baru',
        baseline_rubric: ['Kepercayaan diri', 'Menghadapi tantangan', 'Merasa', 'Konteks: Situasi baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Kepercayaan diri', 'Menghadapi tantangan', 'Merasa', 'Konteks: Situasi baru', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri',
        scale_group: 'asli'
    },
    {
        item_id: '2',
        origin_item_id: '2',
        text: 'Saya merasa bernilai dan dihargai oleh orang lain',
        baseline_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Oleh orang lain', 'Sudut pandang orang pertama'],
        current_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Oleh orang lain', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri',
        scale_group: 'asli'
    },
    {
        item_id: '3',
        origin_item_id: '3',
        text: 'Saya dapat mengatasi masalah dengan baik dan tenang',
        baseline_rubric: ['Mengatasi masalah', 'Ketenangan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Mengatasi masalah', 'Ketenangan', 'Dapat', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri',
        scale_group: 'asli'
    },
    // Dimension 2: Regulasi Emosi (items 4-7)
    {
        item_id: '4',
        origin_item_id: '4',
        text: 'Saya mampu mengekspresikan perasaan saya dengan jelas',
        baseline_rubric: ['Ekspresi perasaan', 'Kejelasan', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Ekspresi perasaan', 'Kejelasan', 'Mampu', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi',
        scale_group: 'asli'
    },
    {
        item_id: '5',
        origin_item_id: '5',
        text: 'Saya merasa nyaman ketika berinteraksi dengan orang baru',
        baseline_rubric: ['Kenyamanan', 'Interaksi sosial', 'Merasa', 'Konteks: Orang baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Kenyamanan', 'Interaksi sosial', 'Merasa', 'Konteks: Orang baru', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi',
        scale_group: 'asli'
    },
    {
        item_id: '6',
        origin_item_id: '6',
        text: 'Saya dapat menerima kritik dengan sikap terbuka',
        baseline_rubric: ['Penerimaan kritik', 'Keterbukaan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Penerimaan kritik', 'Keterbukaan', 'Dapat', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi',
        scale_group: 'asli'
    },
    {
        item_id: '7',
        origin_item_id: '7',
        text: 'Saya mampu mengelola stres dengan efektif',
        baseline_rubric: ['Pengelolaan stres', 'Efektivitas', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Pengelolaan stres', 'Efektivitas', 'Mampu', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi',
        scale_group: 'asli'
    },
    // Dimension 3: Optimisme (items 8-10)
    {
        item_id: '8',
        origin_item_id: '8',
        text: 'Saya merasa optimis tentang masa depan saya',
        baseline_rubric: ['Optimisme', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        current_rubric: ['Optimisme', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme',
        scale_group: 'asli'
    },
    {
        item_id: '9',
        origin_item_id: '9',
        text: 'Saya merasa puas dengan pencapaian hidup saya sejauh ini',
        baseline_rubric: ['Kepuasan', 'Pencapaian Hidup', 'Merasa', 'Sudut Pandang Orang Pertama', 'Waktu: Sejauh Ini'],
        current_rubric: ['Kepuasan', 'Pencapaian Hidup', 'Merasa', 'Sudut Pandang Orang Pertama', 'Waktu: Sejauh Ini'],
        dimension: 'Optimisme',
        scale_group: 'asli'
    },
    {
        item_id: '10',
        origin_item_id: '10',
        text: 'Saya merasa memiliki tujuan hidup yang jelas',
        baseline_rubric: ['Tujuan hidup', 'Merasa', 'Sudut pandang orang pertama'],
        current_rubric: ['Tujuan hidup', 'Merasa', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme',
        scale_group: 'asli'
    },

    // === SKALA GEN-Z (Branch 1) ===
    // Dimension 1
    {
        item_id: 'skala-asli-branch-1-item-1',
        origin_item_id: '1',
        text: 'Saya berani mencoba hal baru tanpa ragu',
        baseline_rubric: ['Kepercayaan diri', 'Menghadapi tantangan', 'Merasa', 'Konteks: Situasi baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Keberanian', 'Mencoba hal baru', 'Tanpa keraguan', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri & Keberanian',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-2',
        origin_item_id: '2',
        text: 'Saya merasa dihargai dan berarti di lingkungan saya',
        baseline_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Oleh orang lain', 'Sudut pandang orang pertama'],
        current_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Konteks: Lingkungan', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri & Keberanian',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-3',
        origin_item_id: '3',
        text: 'Saya bisa mengatasi masalah dengan kepala dingin dan percaya diri',
        baseline_rubric: ['Mengatasi masalah', 'Ketenangan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Mengatasi masalah', 'Ketenangan', 'Kepercayaan diri', 'Bisa', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri & Keberanian',
        scale_group: 'genz'
    },
    // Dimension 2
    {
        item_id: 'skala-asli-branch-1-item-4',
        origin_item_id: '4',
        text: 'Saya bisa mengekspresikan perasaan saya secara jujur dan jelas',
        baseline_rubric: ['Ekspresi perasaan', 'Kejelasan', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Ekspresi perasaan', 'Kejujuran', 'Kejelasan', 'Bisa', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi & Interaksi',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-5',
        origin_item_id: '5',
        text: 'Saya merasa nyaman dan tidak awkward saat bertemu orang baru',
        baseline_rubric: ['Kenyamanan', 'Interaksi sosial', 'Merasa', 'Konteks: Orang baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Kenyamanan', 'Tidak canggung', 'Merasa', 'Konteks: Orang baru', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi & Interaksi',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-6',
        origin_item_id: '6',
        text: 'Saya bisa menerima kritik tanpa baper dan belajar darinya',
        baseline_rubric: ['Penerimaan kritik', 'Keterbukaan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Penerimaan kritik', 'Stabilitas emosi', 'Belajar', 'Bisa', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi & Interaksi',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-7',
        origin_item_id: '7',
        text: 'Saya mampu mengatur stres agar tidak merasa overwhelmed',
        baseline_rubric: ['Pengelolaan stres', 'Efektivitas', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Pengelolaan stres', 'Menghindari kewalahan', 'Mampu', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi & Interaksi',
        scale_group: 'genz'
    },
    // Dimension 3
    {
        item_id: 'skala-asli-branch-1-item-8',
        origin_item_id: '8',
        text: 'Saya optimis tentang masa depan dan peluang yang akan datang',
        baseline_rubric: ['Optimisme', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        current_rubric: ['Optimisme', 'Peluang', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Tujuan (Goals)',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-9',
        origin_item_id: '9',
        text: 'Saya merasa bangga dan puas dengan pencapaian saya sejauh ini',
        baseline_rubric: ['Kepuasan', 'Pencapaian hidup', 'Merasa', 'Waktu: Sejauh ini', 'Sudut pandang orang pertama'],
        current_rubric: ['Kepuasan', 'Kebanggaan', 'Pencapaian', 'Merasa', 'Waktu: Sejauh ini', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Tujuan (Goals)',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-10',
        origin_item_id: '10',
        text: 'Saya memiliki tujuan hidup atau goals yang jelas untuk dicapai',
        baseline_rubric: ['Tujuan hidup', 'Kejelasan', 'Memiliki', 'Sudut pandang orang pertama'],
        current_rubric: ['Tujuan hidup', 'Goals', 'Kejelasan', 'Memiliki', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Tujuan (Goals)',
        scale_group: 'genz'
    },

    // === SKALA BOOMER (Branch 2) ===
    // Dimension 1
    {
        item_id: 'skala-asli-branch-2-item-1',
        origin_item_id: '1',
        text: 'Saya merasa percaya diri menghadapi perubahan dan tantangan yang muncul pada usia saya',
        baseline_rubric: ['Kepercayaan diri', 'Menghadapi tantangan', 'Merasa', 'Konteks: Situasi baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Kepercayaan diri', 'Menghadapi perubahan', 'Menghadapi tantangan', 'Merasa', 'Konteks: Usia', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri pada Usia Boomer',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-2',
        origin_item_id: '2',
        text: 'Saya merasa dihargai dan dianggap berarti oleh keluarga dan komunitas saya',
        baseline_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Oleh orang lain', 'Sudut pandang orang pertama'],
        current_rubric: ['Nilai diri', 'Dihargai', 'Merasa', 'Konteks: Keluarga', 'Konteks: Komunitas', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri pada Usia Boomer',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-3',
        origin_item_id: '3',
        text: 'Saya mampu menyelesaikan masalah sehari-hari dan menghadapi situasi sulit dengan tenang',
        baseline_rubric: ['Mengatasi masalah', 'Ketenangan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Menyelesaikan masalah', 'Menghadapi situasi sulit', 'Ketenangan', 'Mampu', 'Konteks: Sehari-hari', 'Sudut pandang orang pertama'],
        dimension: 'Kepercayaan Diri pada Usia Boomer',
        scale_group: 'boomer'
    },
    // Dimension 2
    {
        item_id: 'skala-asli-branch-2-item-4',
        origin_item_id: '4',
        text: 'Saya dapat mengungkapkan perasaan saya kepada keluarga atau teman dengan jujur dan tepat',
        baseline_rubric: ['Ekspresi perasaan', 'Kejelasan', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Ekspresi perasaan', 'Kejujuran', 'Ketepatan', 'Dapat', 'Konteks: Keluarga/teman', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi dan Interaksi Sosial',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-5',
        origin_item_id: '5',
        text: 'Saya merasa nyaman saat berinteraksi dengan orang baru, termasuk yang berasal dari generasi berbeda',
        baseline_rubric: ['Kenyamanan', 'Interaksi sosial', 'Merasa', 'Konteks: Orang baru', 'Sudut pandang orang pertama'],
        current_rubric: ['Kenyamanan', 'Interaksi sosial', 'Merasa', 'Konteks: Orang baru', 'Konteks: Generasi berbeda', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi dan Interaksi Sosial',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-6',
        origin_item_id: '6',
        text: 'Saya menerima masukan atau kritik dari orang lain dengan sikap terbuka dan bijaksana',
        baseline_rubric: ['Penerimaan kritik', 'Keterbukaan', 'Dapat', 'Sudut pandang orang pertama'],
        current_rubric: ['Penerimaan kritik', 'Keterbukaan', 'Kebijaksanaan', 'Menerima', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi dan Interaksi Sosial',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-7',
        origin_item_id: '7',
        text: 'Saya mampu mengelola stres terkait kesehatan, tanggung jawab keluarga, atau perubahan hidup secara efektif',
        baseline_rubric: ['Pengelolaan stres', 'Efektivitas', 'Mampu', 'Sudut pandang orang pertama'],
        current_rubric: ['Pengelolaan stres', 'Efektivitas', 'Mampu', 'Konteks: Kesehatan', 'Konteks: Keluarga', 'Konteks: Perubahan hidup', 'Sudut pandang orang pertama'],
        dimension: 'Regulasi Emosi dan Interaksi Sosial',
        scale_group: 'boomer'
    },
    // Dimension 3
    {
        item_id: 'skala-asli-branch-2-item-8',
        origin_item_id: '8',
        text: 'Saya merasa optimis tentang kualitas hidup dan kesejahteraan saya di masa mendatang',
        baseline_rubric: ['Optimisme', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        current_rubric: ['Optimisme', 'Kualitas hidup', 'Kesejahteraan', 'Merasa', 'Waktu: Masa depan', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Makna Hidup',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-9',
        origin_item_id: '9',
        text: 'Saya merasa puas dan bangga dengan pencapaian hidup serta peran yang telah saya jalani',
        baseline_rubric: ['Kepuasan', 'Pencapaian hidup', 'Merasa', 'Waktu: Sejauh ini', 'Sudut pandang orang pertama'],
        current_rubric: ['Kepuasan', 'Kebanggaan', 'Pencapaian hidup', 'Peran', 'Merasa', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Makna Hidup',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-10',
        origin_item_id: '10',
        text: 'Saya memiliki tujuan atau kegiatan yang memberi arti dan semangat pada kehidupan saya saat ini',
        baseline_rubric: ['Tujuan hidup', 'Kejelasan', 'Memiliki', 'Sudut pandang orang pertama'],
        current_rubric: ['Tujuan hidup', 'Kegiatan bermakna', 'Semangat', 'Memiliki', 'Waktu: Saat ini', 'Sudut pandang orang pertama'],
        dimension: 'Optimisme dan Makna Hidup',
        scale_group: 'boomer'
    }
];

// ============================================================================
// MOCK SCALE FACTORY
// ============================================================================

/**
 * Create the root mock scale (Skala Asli).
 * 
 * @returns {Scale} Root scale object
 */
function createMockScale() {
    // Filter items for Asli
    const itemsAsli = MOCK_ITEMS.filter(i => i.scale_group === 'asli');

    // Group items by dimension
    const dimensions = [
        { name: 'Kepercayaan Diri', items: itemsAsli.filter(i => i.dimension === 'Kepercayaan Diri') },
        { name: 'Regulasi Emosi', items: itemsAsli.filter(i => i.dimension === 'Regulasi Emosi') },
        { name: 'Optimisme', items: itemsAsli.filter(i => i.dimension === 'Optimisme') }
    ];

    return {
        scale_id: 'skala-asli',
        scale_name: 'Skala Asli - Skala Kepercayaan Diri',
        parent_scale_id: null,
        is_root: true,
        expanded: false,
        depth: 0,
        position: { x: 100, y: 250 },
        dimensions: dimensions
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.MockData = {
        MOCK_ITEMS,
        createMockScale
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOCK_ITEMS,
        createMockScale
    };
}
