import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { DashboardScrollTop } from "./DashboardScrollTop";
import { DashboardEvent } from "@/features/dashboard/components/events/DashboardEvent";
import { useEventList } from "@/features/dashboard/hooks/useEventList";
import { motion } from "motion/react";
import { NoEvents } from "@/features/dashboard/components/errors/NoEvents";
import { useQuery } from "@/query/core";

type Props = {
    id: string;
};

export const DashboardEvents = ({ id }: Props) => {
    // scrolling
    const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
    const { ref } = useScroll<HTMLUListElement>((value) => {
        setHasScrolledEnough(value > 0.5);
    });

    // fetching
    const { data, isLoading } = useQuery({ key: ["events", id] });

    // filtering
    const { filteredEvents } = useEventList(id, data);

    // fallbacks
    if (isLoading) {
        return Array.from({ length: 8 }, (_, k) => (
            <div
                key={k}
                className="w-full h-16 loading rounded-full!"
            />
        ));
    }

    if (!filteredEvents?.length) {
        return <NoEvents />;
    }

    return (
        <>
            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={ref}
                className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark p-1!"
                style={{
                    scrollbarWidth: "thin",
                }}
            >
                {filteredEvents?.map((event) => (
                    <DashboardEvent
                        key={event.id}
                        event={event}
                    />
                ))}
            </motion.ul>

            <DashboardScrollTop
                isVisible={hasScrolledEnough}
                scrollRef={ref}
            />
        </>
    );
};
