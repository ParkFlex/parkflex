import { DateTimeSelection } from "./DateTimeSelection.ts";

export function hasDateFilter(filter: DateTimeSelection<"range">): boolean {
    return !!(filter.days && filter.days.length === 2 && filter.days[0] && filter.days[1]);
}

export function filterByDateRange<T>(
    items: T[],
    filter: DateTimeSelection<"range">,
    getDate: (item: T) => Date
): T[] {
    if (!hasDateFilter(filter)) {
        return items;
    }

    const { days, startTime, endTime } = filter;

    const startDate = new Date(days![0]!);
    if (startTime) {
        startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    } else {
        startDate.setHours(0, 0, 0, 0);
    }

    const endDate = new Date(days![1]!);
    if (endTime) {
        endDate.setHours(endTime.getHours(), endTime.getMinutes(), 59, 999);
    } else {
        endDate.setHours(23, 59, 59, 999);
    }

    return items.filter(item => {
        const itemDate = new Date(getDate(item));
        return itemDate >= startDate && itemDate <= endDate;
    });
}
