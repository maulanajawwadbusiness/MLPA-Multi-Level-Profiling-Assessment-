/**
 * MLPA Prototype - Flow Export Module
 * 
 * MODULE CONTRACT
 * ----------------
 * Responsibility: Export scales to CSV format
 * Inputs: Scales Map, scale ID
 * Outputs: CSV file download
 * Allowed side effects: File download trigger
 * Forbidden responsibilities:
 *   - NO rendering
 *   - NO state mutation
 *   - NO business logic
 */

const FlowExport = (function () {
    'use strict';

    /**
     * Export a single scale to CSV.
     * 
     * @param {string} scaleId - Scale ID to export
     * @param {Map<string, Scale>} scales - Scales Map
     */
    function exportScale(scaleId, scales) {
        const scale = scales.get(scaleId);
        if (!scale) {
            console.error('Scale not found:', scaleId);
            return;
        }

        // Flatten all items from all dimensions
        const allItems = [];
        let itemCounter = 1;

        (scale.dimensions || []).forEach(dimension => {
            const dimensionName = dimension.name || '';
            const items = dimension.items || [];

            items.forEach(item => {
                allItems.push({
                    item_id: itemCounter++,
                    dimension: dimensionName,
                    item_text: item.text || ''
                });
            });
        });

        // Convert to CSV
        const csvContent = convertToCSV(allItems, ['item_id', 'dimension', 'item_text']);

        // Generate filename
        const filename = `${sanitizeFilename(scale.scale_name || 'scale')}.csv`;

        // Trigger download
        downloadCSV(csvContent, filename);
    }

    /**
     * Export all scales to CSV.
     * 
     * @param {Map<string, Scale>} scales - Scales Map
     */
    function exportAllScales(scales) {
        const rows = [['scale_id', 'scale_name', 'parent_scale_id', 'dimension_name', 'item_id', 'origin_item_id', 'item_text', 'baseline_rubric', 'current_rubric']];

        scales.forEach(scale => {
            scale.dimensions.forEach(dim => {
                dim.items.forEach(item => {
                    rows.push([
                        scale.scale_id,
                        scale.scale_name,
                        scale.parent_scale_id || '',
                        dim.name,
                        item.item_id,
                        item.origin_item_id,
                        item.text,
                        (item.baseline_rubric || []).join(';'),
                        (item.current_rubric || []).join(';')
                    ]);
                });
            });
        });

        const csvContent = rows.map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        downloadCSV(csvContent, 'MLPA_All_Scale.csv');
    }

    /**
     * Convert data array to CSV string.
     * @private
     */
    function convertToCSV(data, columns) {
        // Header row
        const header = columns.join(',');

        // Data rows
        const rows = data.map(row => {
            return columns.map(col => {
                const value = row[col] ?? '';
                // Escape quotes and wrap in quotes if contains comma/quote/newline
                if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
                    return `"${value.toString().replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        return [header, ...rows].join('\r\n');
    }

    /**
     * Sanitize string for use as filename.
     * @private
     */
    function sanitizeFilename(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    /**
     * Trigger CSV file download.
     * @private
     */
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    return {
        exportScale,
        exportAllScales
    };
})();

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.FlowExport = FlowExport;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowExport;
}
