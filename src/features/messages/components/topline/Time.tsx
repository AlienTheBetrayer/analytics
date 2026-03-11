/** @format */

import { useTime } from "@/hooks/useTime";

export const Time = () => {
    // 12:59 PM (example)
    const { time } = useTime();

    // jsx
    return <span className="flex items-center gap-1">{time}</span>;
};
