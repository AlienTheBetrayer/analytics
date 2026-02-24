import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export const useTime = () => {
    const [time, setTime] = useState<string>("");

    useEffect(() => {
        const handle = () => {
            setTime(format(new Date(), "hh:mm a"));
        };
        handle();

        const interval = setInterval(handle, 20000);
        return () => clearInterval(interval);
    }, []);

    return useMemo(() => {
        return {
            time,
        };
    }, [time]);
};
