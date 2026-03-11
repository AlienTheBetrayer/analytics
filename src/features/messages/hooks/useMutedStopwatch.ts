import { relativeTime as _relativeTime } from "@/utils/other/relativeTime";
import { useEffect, useMemo, useState } from "react";

export const useMutedStopwatch = (initialDate?: string) => {
    // states
    const [relativeTime, setRelativeTime] = useState<string>("");

    // ui states
    const isMuted = initialDate ? new Date(initialDate) > new Date() : false;

    // stopwatch
    useEffect(() => {
        if (!isMuted || typeof initialDate !== "string") {
            return;
        }

        const interval = setInterval(() => {
            setRelativeTime(_relativeTime(initialDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [initialDate, isMuted]);

    // returning
    return useMemo(() => {
        return {
            isMuted,
            relativeTime,
        };
    }, [isMuted, relativeTime]);
};
