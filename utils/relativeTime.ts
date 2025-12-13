import { formatDistanceToNow, parseISO } from "date-fns";

export const relativeTime = (date: string | undefined) => {
    if(date === undefined)
        return '';
    
	const parsedDate = parseISO(date);
	return formatDistanceToNow(parsedDate, { addSuffix: true });
};
