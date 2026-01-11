
export const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
};

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

export const formatDateWeek = (date: Date): string => {
    return date.toLocaleDateString('pl-EU', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pl-EU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
};

export const formatLocalDateTime = (date: Date): string => {
    const padding2 = (x: number) => String(x).padStart(2, "0");
    return `${date.getFullYear()}-${padding2(date.getMonth() + 1)}-${padding2(
        date.getDate()
    )}T${padding2(date.getHours())}:${padding2(date.getMinutes())}:${padding2(
        date.getSeconds()
    )}`;
};


export const formatDateTime = (date: Date): string => {
    return date.toLocaleString('pl-EU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

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

export const isActiveNow = (startTime: Date, durationMin: number): boolean => {
    const now = new Date();
    const endTime = addMinutes(startTime, durationMin);
    return now >= startTime && now <= endTime;
};

export const compareTime = (lhs: Date, rhs: Date): -1 | 0 | 1 => {
    const lhsMins = lhs.getMinutes() + lhs.getHours() * 60;
    const rhsMins = rhs.getMinutes() + rhs.getHours() * 60;

    if (lhsMins < rhsMins) return -1;
    if (lhsMins === rhsMins) return 0;
    return 1;
};