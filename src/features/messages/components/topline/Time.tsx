import { useTime } from "@/hooks/useTime";

export const Time = () => {
    const { time } = useTime();

    return <span className="flex items-center gap-1">{time}</span>;
};
