import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

/**
 * gets the proximity to a given date and then converts it to a human-like version
 * @param date a date you want to get the promixity to
 * @returns a string containing a human-like proximity to the date
 */
export const relativeTime = (date: string | undefined) => {
    if (!date) {
        return "";
    }

    const parsedDate = parseISO(date);
    return formatDistanceToNowStrict(parsedDate, { addSuffix: true });
};

/**
 * converts a date string into a human-readable clock time
 * @param date ISO date string
 * @returns string like "10:45 PM"
 */
export const exactTime = (date: string | undefined) => {
    if (!date) {
        return "";
    }

    const parsedDate = parseISO(date);
    return format(parsedDate, "p");
};
