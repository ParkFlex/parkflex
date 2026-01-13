/**
 * Moduł zawierający funkcje pomocnicze do operacji na datach i czasie.
 * @module utils/dateUtils
 */

/**
 * Dodaje określoną liczbę minut do daty.
 * 
 * @param date - Data bazowa
 * @param minutes - Liczba minut do dodania
 * @returns Nowy obiekt Date z dodanymi minutami
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * const inHour = addMinutes(now, 60);
 * ```
 */
export const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
};

/**
 * Formatuje czas w formacie HH:MM (24-godzinny).
 * 
 * @param date - Data do sformatowania
 * @returns String w formacie "HH:MM"
 * 
 * @example
 * ```typescript
 * formatTime(new Date(2026, 0, 12, 14, 30)); // "14:30"
 * ```
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

/**
 * Formatuje datę z dniem tygodnia w formacie polskim.
 * 
 * @param date - Data do sformatowania
 * @returns String zawierający dzień tygodnia i datę (np. "piątek, 12.1.2026")
 * 
 * @example
 * ```typescript
 * formatDateWeek(new Date(2026, 0, 12)); // "niedziela, 12.1.2026"
 * ```
 */
export const formatDateWeek = (date: Date): string => {
    return date.toLocaleDateString('pl-EU', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

/**
 * Formatuje datę w formacie polskim bez dnia tygodnia.
 * 
 * @param date - Data do sformatowania
 * @returns String z datą w formacie "DD.MM.RRRR"
 * 
 * @example
 * ```typescript
 * formatDate(new Date(2026, 0, 12)); // "12.1.2026"
 * ```
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pl-EU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

/**
 * Formatuje datę i czas do formatu ISO 8601 (local time).
 * 
 * @param date - Data i czas do sformatowania
 * @returns String w formacie "YYYY-MM-DDTHH:MM:SS"
 * 
 * @remarks
 * Funkcja używana głównie do komunikacji z API backendu.
 * Format jest zgodny z ISO 8601 ale bez strefy czasowej.
 * 
 * @example
 * ```typescript
 * formatLocalDateTime(new Date(2026, 0, 12, 14, 30, 0)); // "2026-01-12T14:30:00"
 * ```
 */
export const formatLocalDateTime = (date: Date): string => {
    const padding2 = (x: number) => String(x).padStart(2, "0");
    return `${date.getFullYear()}-${padding2(date.getMonth() + 1)}-${padding2(
        date.getDate()
    )}T${padding2(date.getHours())}:${padding2(date.getMinutes())}:${padding2(
        date.getSeconds()
    )}`;
};


/**
 * Sprawdza czy dwie daty to ten sam dzień.
 * 
 * @param date1 - Pierwsza data do porównania
 * @param date2 - Druga data do porównania
 * @returns true jeśli daty reprezentują ten sam dzień (rok, miesiąc, dzień)
 * 
 * @remarks
 * Ignoruje godziny, minuty i sekundy - porównuje tylko rok, miesiąc i dzień.
 * 
 * @example
 * ```typescript
 * const date1 = new Date(2026, 0, 12, 10, 0);
 * const date2 = new Date(2026, 0, 12, 15, 30);
 * isSameDay(date1, date2); // true
 * ```
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

/**
 * Sprawdza czy rezerwacja zakończyła się przed obecnym momentem.
 * 
 * @param startTime - Czas rozpoczęcia rezerwacji
 * @param duration - Czas trwania w minutach
 * @returns true jeśli rezerwacja już się zakończyła
 * 
 * @remarks
 * TODO: Logika wygląda na nieprawidłową (endTime < endDate zawsze false).
 * Należy zweryfikować i naprawić implementację.
 * 
 * @example
 * ```typescript
 * const past = new Date(2026, 0, 12, 10, 0);
 * endsBeforeNow(past, 60); // prawdopodobnie zawsze false
 * ```
 */
export const endsBeforeNow = (startTime: Date, duration: number): boolean => {
    const endTime = addMinutes(startTime, duration);
    const endDate = new Date(
        endTime.getFullYear(),
        endTime.getMonth(),
        endTime.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
    );

    return endTime <  endDate;
};

/**
 * Sprawdza czy rezerwacja jest aktywna w obecnym momencie.
 * 
 * @param startTime - Czas rozpoczęcia rezerwacji
 * @param durationMin - Czas trwania w minutach
 * @returns true jeśli obecny czas mieści się w zakresie rezerwacji
 * 
 * @remarks
 * Rezerwacja jest aktywna jeśli obecny moment jest między czasem
 * rozpoczęcia a czasem zakończenia (start + duration).
 * 
 * @example
 * ```typescript
 * const now = new Date();
 * isActiveNow(now, 60); // true przez najbliższą godzinę
 * ```
 */
export const isActiveNow = (startTime: Date, durationMin: number): boolean => {
    const now = new Date();
    const endTime = addMinutes(startTime, durationMin);
    return now >= startTime && now <= endTime;
};

/**
 * Porównuje godziny dwóch dat (ignorując dzień).
 * 
 * @param lhs - Pierwsza data (left-hand side)
 * @param rhs - Druga data (right-hand side)
 * @returns -1 jeśli lhs < rhs, 0 jeśli równe, 1 jeśli lhs > rhs
 * 
 * @remarks
 * Porównuje tylko godziny i minuty, ignorując rok, miesiąc i dzień.
 * Przydatne do sortowania i porównywania przedziałów czasowych w ciągu dnia.
 * 
 * @example
 * ```typescript
 * const morning = new Date(2026, 0, 12, 9, 0);
 * const afternoon = new Date(2026, 0, 13, 15, 30); // inny dzień!
 * compareTime(morning, afternoon); // -1 (9:00 < 15:30)
 * ```
 */
export const compareTime = (lhs: Date, rhs: Date): -1 | 0 | 1 => {
    const lhsMins = lhs.getMinutes() + lhs.getHours() * 60;
    const rhsMins = rhs.getMinutes() + rhs.getHours() * 60;

    if (lhsMins < rhsMins) return -1;
    if (lhsMins === rhsMins) return 0;
    return 1;
};