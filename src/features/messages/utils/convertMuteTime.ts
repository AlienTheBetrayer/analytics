import { MuteOptions } from "@/features/messages/components/message/topline/parts/members/settings/Muting";

/**
 * converts time and option to an ISO date object
 * @param time time number
 * @param option time option
 * @returns ISO date object
 */
export const convertMuteTime = (
    time: string | number,
    option: (typeof MuteOptions)[number],
) => {
    const times: Record<(typeof MuteOptions)[number], number> = {
        Seconds: 1,
        Minutes: 60,
        Hours: 60 * 60,
        Days: 60 * 60 * 24,
        Weeks: 60 * 60 * 24 * 7,
        Months: 60 * 60 * 24 * 7 * 30,
    };

    const calculated = +time * times[option];

    return new Date(Date.now() + calculated * 1000).toISOString();
};
