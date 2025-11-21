
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
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

export const isBeforeToday = (date: Date): boolean => {
    const today = new Date();
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
}