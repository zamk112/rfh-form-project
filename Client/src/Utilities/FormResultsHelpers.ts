export function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return 'Not provided';
    }

    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : 'None selected';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
};

export function formatKey(key: string): string {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

