

export function formatDate(date: Date | undefined, locale?: string, format?: Intl.DateTimeFormatOptions) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString(locale || "en-US", format || {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

export function addDays(date: Date, type: 'day' | 'week' | 'range' | 'month'): Date {

    let adding = 0
    switch (type) {
        case 'day':
            adding = 1
            break;
        case 'week':
            adding = 7
            break;
        case 'month':
            adding = 30
            break;
    }
    const newDate = new Date((date.getTime() + adding * 24 * 60 * 60 * 1000) - 1000)
    return newDate
}
