import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {format, parse} from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function parseDate(dateString: string, dateFormat): string {
    const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
    return format(parsedDate, dateFormat);
}
