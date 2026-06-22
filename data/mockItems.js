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
    // === ORIGINAL SCALE ===
    // Dimension 1: Self-Confidence (items 1-3)
    {
        item_id: '1',
        origin_item_id: '1',
        text: 'I feel confident in facing new challenges',
        baseline_rubric: ['Self-confidence', 'Facing challenges', 'Feeling', 'Context: New situations', 'First-person perspective'],
        current_rubric: ['Self-confidence', 'Facing challenges', 'Feeling', 'Context: New situations', 'First-person perspective'],
        dimension: 'Self-Confidence',
        scale_group: 'asli'
    },
    {
        item_id: '2',
        origin_item_id: '2',
        text: 'I feel valued and appreciated by others',
        baseline_rubric: ['Self-worth', 'Valued', 'Feeling', 'By others', 'First-person perspective'],
        current_rubric: ['Self-worth', 'Valued', 'Feeling', 'By others', 'First-person perspective'],
        dimension: 'Self-Confidence',
        scale_group: 'asli'
    },
    {
        item_id: '3',
        origin_item_id: '3',
        text: 'I can handle problems calmly and effectively',
        baseline_rubric: ['Problem-solving', 'Calmness', 'Able', 'First-person perspective'],
        current_rubric: ['Problem-solving', 'Calmness', 'Able', 'First-person perspective'],
        dimension: 'Self-Confidence',
        scale_group: 'asli'
    },
    // Dimension 2: Emotional Regulation (items 4-7)
    {
        item_id: '4',
        origin_item_id: '4',
        text: 'I am able to express my feelings clearly',
        baseline_rubric: ['Expression of feelings', 'Clarity', 'Able', 'First-person perspective'],
        current_rubric: ['Expression of feelings', 'Clarity', 'Able', 'First-person perspective'],
        dimension: 'Emotional Regulation',
        scale_group: 'asli'
    },
    {
        item_id: '5',
        origin_item_id: '5',
        text: 'I feel comfortable when interacting with new people',
        baseline_rubric: ['Comfort', 'Social interaction', 'Feeling', 'Context: New people', 'First-person perspective'],
        current_rubric: ['Comfort', 'Social interaction', 'Feeling', 'Context: New people', 'First-person perspective'],
        dimension: 'Emotional Regulation',
        scale_group: 'asli'
    },
    {
        item_id: '6',
        origin_item_id: '6',
        text: 'I can accept criticism with an open attitude',
        baseline_rubric: ['Acceptance of criticism', 'Openness', 'Able', 'First-person perspective'],
        current_rubric: ['Acceptance of criticism', 'Openness', 'Able', 'First-person perspective'],
        dimension: 'Emotional Regulation',
        scale_group: 'asli'
    },
    {
        item_id: '7',
        origin_item_id: '7',
        text: 'I am able to manage stress effectively',
        baseline_rubric: ['Stress management', 'Effectiveness', 'Able', 'First-person perspective'],
        current_rubric: ['Stress management', 'Effectiveness', 'Able', 'First-person perspective'],
        dimension: 'Emotional Regulation',
        scale_group: 'asli'
    },
    // Dimension 3: Optimism (items 8-10)
    {
        item_id: '8',
        origin_item_id: '8',
        text: 'I feel optimistic about my future',
        baseline_rubric: ['Optimism', 'Feeling', 'Time: Future', 'First-person perspective'],
        current_rubric: ['Optimism', 'Feeling', 'Time: Future', 'First-person perspective'],
        dimension: 'Optimism',
        scale_group: 'asli'
    },
    {
        item_id: '9',
        origin_item_id: '9',
        text: 'I feel satisfied with my life achievements so far',
        baseline_rubric: ['Satisfaction', 'Life achievements', 'Feeling', 'First-person perspective', 'Time: So far'],
        current_rubric: ['Satisfaction', 'Life achievements', 'Feeling', 'First-person perspective', 'Time: So far'],
        dimension: 'Optimism',
        scale_group: 'asli'
    },
    {
        item_id: '10',
        origin_item_id: '10',
        text: 'I feel I have a clear life purpose',
        baseline_rubric: ['Life purpose', 'Feeling', 'First-person perspective'],
        current_rubric: ['Life purpose', 'Feeling', 'First-person perspective'],
        dimension: 'Optimism',
        scale_group: 'asli'
    },

    // === GEN-Z SCALE (Branch 1) ===
    // Dimension 1
    {
        item_id: 'skala-asli-branch-1-item-1',
        origin_item_id: '1',
        text: 'I dare to try new things without hesitation',
        baseline_rubric: ['Self-confidence', 'Facing challenges', 'Feeling', 'Context: New situations', 'First-person perspective'],
        current_rubric: ['Courage', 'Trying new things', 'Without hesitation', 'First-person perspective'],
        dimension: 'Self-Confidence & Courage',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-2',
        origin_item_id: '2',
        text: 'I feel valued and matter in my environment',
        baseline_rubric: ['Self-worth', 'Valued', 'Feeling', 'By others', 'First-person perspective'],
        current_rubric: ['Self-worth', 'Valued', 'Feeling', 'Context: Environment', 'First-person perspective'],
        dimension: 'Self-Confidence & Courage',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-3',
        origin_item_id: '3',
        text: 'I can handle problems with a cool head and confidence',
        baseline_rubric: ['Problem-solving', 'Calmness', 'Able', 'First-person perspective'],
        current_rubric: ['Problem-solving', 'Calmness', 'Self-confidence', 'Can', 'First-person perspective'],
        dimension: 'Self-Confidence & Courage',
        scale_group: 'genz'
    },
    // Dimension 2
    {
        item_id: 'skala-asli-branch-1-item-4',
        origin_item_id: '4',
        text: 'I can express my feelings honestly and clearly',
        baseline_rubric: ['Expression of feelings', 'Clarity', 'Able', 'First-person perspective'],
        current_rubric: ['Expression of feelings', 'Honesty', 'Clarity', 'Can', 'First-person perspective'],
        dimension: 'Emotional Regulation & Interaction',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-5',
        origin_item_id: '5',
        text: 'I feel comfortable and not awkward meeting new people',
        baseline_rubric: ['Comfort', 'Social interaction', 'Feeling', 'Context: New people', 'First-person perspective'],
        current_rubric: ['Comfort', 'Not awkward', 'Feeling', 'Context: New people', 'First-person perspective'],
        dimension: 'Emotional Regulation & Interaction',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-6',
        origin_item_id: '6',
        text: 'I can accept criticism without getting emotional and learn from it',
        baseline_rubric: ['Acceptance of criticism', 'Openness', 'Able', 'First-person perspective'],
        current_rubric: ['Acceptance of criticism', 'Emotional stability', 'Learning', 'Can', 'First-person perspective'],
        dimension: 'Emotional Regulation & Interaction',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-7',
        origin_item_id: '7',
        text: 'I can manage stress so I don\'t feel overwhelmed',
        baseline_rubric: ['Stress management', 'Effectiveness', 'Able', 'First-person perspective'],
        current_rubric: ['Stress management', 'Avoiding overwhelm', 'Able', 'First-person perspective'],
        dimension: 'Emotional Regulation & Interaction',
        scale_group: 'genz'
    },
    // Dimension 3
    {
        item_id: 'skala-asli-branch-1-item-8',
        origin_item_id: '8',
        text: 'I am optimistic about the future and opportunities ahead',
        baseline_rubric: ['Optimism', 'Feeling', 'Time: Future', 'First-person perspective'],
        current_rubric: ['Optimism', 'Opportunities', 'Feeling', 'Time: Future', 'First-person perspective'],
        dimension: 'Optimism and Goals',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-9',
        origin_item_id: '9',
        text: 'I feel proud and satisfied with my achievements so far',
        baseline_rubric: ['Satisfaction', 'Life achievements', 'Feeling', 'Time: So far', 'First-person perspective'],
        current_rubric: ['Satisfaction', 'Pride', 'Achievements', 'Feeling', 'Time: So far', 'First-person perspective'],
        dimension: 'Optimism and Goals',
        scale_group: 'genz'
    },
    {
        item_id: 'skala-asli-branch-1-item-10',
        origin_item_id: '10',
        text: 'I have clear life goals to achieve',
        baseline_rubric: ['Life purpose', 'Clarity', 'Having', 'First-person perspective'],
        current_rubric: ['Life purpose', 'Goals', 'Clarity', 'Having', 'First-person perspective'],
        dimension: 'Optimism and Goals',
        scale_group: 'genz'
    },

    // === BOOMER SCALE (Branch 2) ===
    // Dimension 1
    {
        item_id: 'skala-asli-branch-2-item-1',
        origin_item_id: '1',
        text: 'I feel confident facing the changes and challenges that come at my age',
        baseline_rubric: ['Self-confidence', 'Facing challenges', 'Feeling', 'Context: New situations', 'First-person perspective'],
        current_rubric: ['Self-confidence', 'Facing changes', 'Facing challenges', 'Feeling', 'Context: Age', 'First-person perspective'],
        dimension: 'Self-Confidence at Boomer Age',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-2',
        origin_item_id: '2',
        text: 'I feel valued and meaningful to my family and community',
        baseline_rubric: ['Self-worth', 'Valued', 'Feeling', 'By others', 'First-person perspective'],
        current_rubric: ['Self-worth', 'Valued', 'Feeling', 'Context: Family', 'Context: Community', 'First-person perspective'],
        dimension: 'Self-Confidence at Boomer Age',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-3',
        origin_item_id: '3',
        text: 'I am able to solve daily problems and handle difficult situations calmly',
        baseline_rubric: ['Problem-solving', 'Calmness', 'Able', 'First-person perspective'],
        current_rubric: ['Solving problems', 'Handling difficult situations', 'Calmness', 'Able', 'Context: Daily life', 'First-person perspective'],
        dimension: 'Self-Confidence at Boomer Age',
        scale_group: 'boomer'
    },
    // Dimension 2
    {
        item_id: 'skala-asli-branch-2-item-4',
        origin_item_id: '4',
        text: 'I can express my feelings to family or friends honestly and accurately',
        baseline_rubric: ['Expression of feelings', 'Clarity', 'Able', 'First-person perspective'],
        current_rubric: ['Expression of feelings', 'Honesty', 'Accuracy', 'Can', 'Context: Family/friends', 'First-person perspective'],
        dimension: 'Emotional Regulation and Social Interaction',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-5',
        origin_item_id: '5',
        text: 'I feel comfortable interacting with new people, including those from different generations',
        baseline_rubric: ['Comfort', 'Social interaction', 'Feeling', 'Context: New people', 'First-person perspective'],
        current_rubric: ['Comfort', 'Social interaction', 'Feeling', 'Context: New people', 'Context: Different generations', 'First-person perspective'],
        dimension: 'Emotional Regulation and Social Interaction',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-6',
        origin_item_id: '6',
        text: 'I accept input or criticism from others with an open and wise attitude',
        baseline_rubric: ['Acceptance of criticism', 'Openness', 'Able', 'First-person perspective'],
        current_rubric: ['Acceptance of criticism', 'Openness', 'Wisdom', 'Accepting', 'First-person perspective'],
        dimension: 'Emotional Regulation and Social Interaction',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-7',
        origin_item_id: '7',
        text: 'I am able to effectively manage stress related to health, family responsibilities, or life changes',
        baseline_rubric: ['Stress management', 'Effectiveness', 'Able', 'First-person perspective'],
        current_rubric: ['Stress management', 'Effectiveness', 'Able', 'Context: Health', 'Context: Family', 'Context: Life changes', 'First-person perspective'],
        dimension: 'Emotional Regulation and Social Interaction',
        scale_group: 'boomer'
    },
    // Dimension 3
    {
        item_id: 'skala-asli-branch-2-item-8',
        origin_item_id: '8',
        text: 'I feel optimistic about my quality of life and well-being in the future',
        baseline_rubric: ['Optimism', 'Feeling', 'Time: Future', 'First-person perspective'],
        current_rubric: ['Optimism', 'Quality of life', 'Well-being', 'Feeling', 'Time: Future', 'First-person perspective'],
        dimension: 'Optimism and Life Meaning',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-9',
        origin_item_id: '9',
        text: 'I feel satisfied and proud of my life achievements and the roles I have played',
        baseline_rubric: ['Satisfaction', 'Life achievements', 'Feeling', 'Time: So far', 'First-person perspective'],
        current_rubric: ['Satisfaction', 'Pride', 'Life achievements', 'Roles', 'Feeling', 'First-person perspective'],
        dimension: 'Optimism and Life Meaning',
        scale_group: 'boomer'
    },
    {
        item_id: 'skala-asli-branch-2-item-10',
        origin_item_id: '10',
        text: 'I have purposes or activities that give meaning and spirit to my life today',
        baseline_rubric: ['Life purpose', 'Clarity', 'Having', 'First-person perspective'],
        current_rubric: ['Life purpose', 'Meaningful activities', 'Spirit', 'Having', 'Time: Currently', 'First-person perspective'],
        dimension: 'Optimism and Life Meaning',
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
        { name: 'Self-Confidence', items: itemsAsli.filter(i => i.dimension === 'Self-Confidence') },
        { name: 'Emotional Regulation', items: itemsAsli.filter(i => i.dimension === 'Emotional Regulation') },
        { name: 'Optimism', items: itemsAsli.filter(i => i.dimension === 'Optimism') }
    ];

    return {
        scale_id: 'skala-asli',
        scale_name: 'Original Scale - Self-Confidence Scale',
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
