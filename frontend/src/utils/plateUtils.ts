export const normalizePlate = (plate: string): string => {
    return plate
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "");
};

export const isPlateValid = (plate: string): boolean => {
    const plateRegex = /^[A-Z]{1,3}[0-9]{2,5}$/;
    return plateRegex.test(plate);
};
