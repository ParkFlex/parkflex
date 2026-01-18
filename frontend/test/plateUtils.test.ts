import { isPlateValid, normalizePlate } from '../src/utils/plateUtils';

describe('Polish Registration Plate Validation', () => {
    describe('2-letter district code patterns', () => {
        it('I resource: 2 letters + 5 digits (XY12345)', () => {
            expect(isPlateValid('XY12345')).toBe(true);
            expect(isPlateValid('WP12345')).toBe(true);
            expect(isPlateValid('KR00001')).toBe(true);
            expect(isPlateValid('KR99999')).toBe(true);
        });

        it('II resource: 2 letters + 4 digits + 1 letter (XY1234A)', () => {
            expect(isPlateValid('XY1234A')).toBe(true);
            expect(isPlateValid('WP0001Z')).toBe(true);
            expect(isPlateValid('KR9999B')).toBe(true);
        });

        it('III resource: 2 letters + 3 digits + 2 letters (XY123AC)', () => {
            expect(isPlateValid('XY123AC')).toBe(true);
            expect(isPlateValid('WP001ZZ')).toBe(true);
            expect(isPlateValid('KR999AB')).toBe(true);
        });

        it('IV resource: 2 letters + 1 digit(1-9) + 1 letter + 3 digits (XY1A234)', () => {
            expect(isPlateValid('XY1A234')).toBe(true);
            expect(isPlateValid('WP9Z999')).toBe(true);
            expect(isPlateValid('KR1B001')).toBe(true);
            // First digit cannot be 0
            expect(isPlateValid('XY0A234')).toBe(false);
        });

        it('V resource: 2 letters + 1 digit(1-9) + 2 letters + 2 digits (XY1AC23)', () => {
            expect(isPlateValid('XY1AC23')).toBe(true);
            expect(isPlateValid('WP9ZZ99')).toBe(true);
            expect(isPlateValid('KR1AB01')).toBe(true);
            // First digit cannot be 0
            expect(isPlateValid('XY0AC23')).toBe(false);
        });
    });

    describe('3-letter district code patterns', () => {
        it('I resource: 3 letters + 1 letter + 3 digits (XYZA123)', () => {
            expect(isPlateValid('XYZA123')).toBe(true);
            expect(isPlateValid('WPZZ999')).toBe(true);
        });

        it('II resource: 3 letters + 2 digits + 2 letters (XYZ12AC)', () => {
            expect(isPlateValid('XYZ12AC')).toBe(true);
            expect(isPlateValid('WPZ99ZZ')).toBe(true);
        });

        it('III resource: 3 letters + 1 digit(1-9) + 1 letter + 2 digits (XYZ1A23)', () => {
            expect(isPlateValid('XYZ1A23')).toBe(true);
            expect(isPlateValid('WPZ9Z99')).toBe(true);
            // First digit cannot be 0
            expect(isPlateValid('XYZ0A23')).toBe(false);
        });

        it('IV resource: 3 letters + 2 digits + 1 letter + 1 digit(1-9) (XYZ12A3)', () => {
            expect(isPlateValid('XYZ12A3')).toBe(true);
            expect(isPlateValid('WPZ99Z9')).toBe(true);
            // Last digit cannot be 0
            expect(isPlateValid('XYZ12A0')).toBe(false);
        });

        it('V resource: 3 letters + 1 digit(1-9) + 2 letters + 1 digit(1-9) (XYZ1AC2)', () => {
            expect(isPlateValid('XYZ1AC2')).toBe(true);
            expect(isPlateValid('WPZ9ZZ9')).toBe(true);
            // No digit can be 0
            expect(isPlateValid('XYZ0AC2')).toBe(false);
            expect(isPlateValid('XYZ1AC0')).toBe(false);
        });

        it('VI resource: 3 letters + 2 letters + 2 digits (XYZAC12)', () => {
            expect(isPlateValid('XYZAC12')).toBe(true);
            expect(isPlateValid('WPZZAC99')).toBe(true);
        });

        it('VII resource: 3 letters + 5 digits (XYZ12345)', () => {
            expect(isPlateValid('XYZ12345')).toBe(true);
            expect(isPlateValid('WPZ00001')).toBe(true);
        });

        it('VIII resource: 3 letters + 4 digits + 1 letter (XYZ1234A)', () => {
            expect(isPlateValid('XYZ1234A')).toBe(true);
            expect(isPlateValid('WPZ0001Z')).toBe(true);
        });

        it('IX resource: 3 letters + 3 digits + 2 letters (XYZ123AC)', () => {
            expect(isPlateValid('XYZ123AC')).toBe(true);
            expect(isPlateValid('WPZ001ZZ')).toBe(true);
        });

        it('X resource: 3 letters + 1 letter + 2 digits + 1 letter (XYZA12C)', () => {
            expect(isPlateValid('XYZA12C')).toBe(true);
            expect(isPlateValid('WPZZ99Z')).toBe(true);
        });

        it('XI resource: 3 letters + 1 letter + 1 digit(1-9) + 2 letters (XYZA1CE)', () => {
            expect(isPlateValid('XYZA1CE')).toBe(true);
            expect(isPlateValid('WPZZ9ZZ')).toBe(true);
            // Digit cannot be 0
            expect(isPlateValid('XYZA0CE')).toBe(false);
        });
    });

    describe('normalizePlate function', () => {
        it('removes spaces and hyphens', () => {
            expect(normalizePlate('XY 12345')).toBe('XY12345');
            expect(normalizePlate('XY-12345')).toBe('XY12345');
            expect(normalizePlate('XY - 12345')).toBe('XY12345');
        });

        it('converts to uppercase', () => {
            expect(normalizePlate('xy12345')).toBe('XY12345');
            expect(normalizePlate('Xy12345')).toBe('XY12345');
        });

        it('trims whitespace', () => {
            expect(normalizePlate('  XY12345  ')).toBe('XY12345');
        });
    });

    describe('invalid patterns', () => {
        it('rejects non-matching patterns', () => {
            expect(isPlateValid('1234567')).toBe(false);
            expect(isPlateValid('XYZABC')).toBe(false);
            expect(isPlateValid('XY')).toBe(false);
            expect(isPlateValid('XYZA')).toBe(false);
        });
    });
});
