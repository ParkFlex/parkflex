export const normalizePlate = (plate: string): string => {
    return plate
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
};

export const isPlateValid = (plate: string): boolean => {
    // Polish registration plate formats
    // 2-letter district code patterns:
    const patterns2Letter = [
        /^[A-Z]{2}\d{5}$/,           // I: XY12345
        /^[A-Z]{2}\d{4}[A-Z]$/,       // II: XY1234A
        /^[A-Z]{2}\d{3}[A-Z]{2}$/,    // III: XY123AC
        /^[A-Z]{2}[1-9][A-Z]\d{3}$/,  // IV: XY1A234 (first digit 1-9)
        /^[A-Z]{2}[1-9][A-Z]{2}\d{2}$/, // V: XY1AC23 (first digit 1-9)
    ];

    // 3-letter district code patterns:
    const patterns3Letter = [
        /^[A-Z]{3}[A-Z]\d{3}$/,       // I: XYZA123
        /^[A-Z]{3}\d{2}[A-Z]{2}$/,    // II: XYZ12AC
        /^[A-Z]{3}[1-9][A-Z]\d{2}$/,  // III: XYZ1A23 (first digit 1-9)
        /^[A-Z]{3}\d{2}[A-Z][1-9]$/,  // IV: XYZ12A3 (last digit 1-9)
        /^[A-Z]{3}[1-9][A-Z]{2}[1-9]$/, // V: XYZ1AC2 (no digit can be 0)
        /^[A-Z]{3}[A-Z]{2}\d{2}$/,    // VI: XYZAC12
        /^[A-Z]{3}\d{5}$/,            // VII: XYZ12345
        /^[A-Z]{3}\d{4}[A-Z]$/,       // VIII: XYZ1234A
        /^[A-Z]{3}\d{3}[A-Z]{2}$/,    // IX: XYZ123AC
        /^[A-Z]{3}[A-Z]\d{2}[A-Z]$/,  // X: XYZA12C
        /^[A-Z]{3}[A-Z][1-9][A-Z]{2}$/, // XI: XYZA1CE (digit ≠ 0)
    ];

    return [...patterns2Letter, ...patterns3Letter].some((regex) => regex.test(plate));
};
