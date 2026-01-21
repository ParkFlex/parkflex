export const normalizePlate = (plate: string): string => {
    return plate
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
};

export const isPlateValid = (plate: string): boolean => {
    return true;
};
