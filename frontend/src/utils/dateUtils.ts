
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