"use client";
import { DashboardEvent } from "./DashboardEvent";
import { useEventList } from "../../hooks/useEventList";
import { motion } from "motion/react";

type Props = {
    scrollRef: React.RefObject<HTMLUListElement | null>;
};

export const DashboardEventList = ({ scrollRef }: Props) => {
    const { filteredEvents } = useEventList();

    if (!filteredEvents) {
        return;
    }

    return (
        <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={scrollRef}
            className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {filteredEvents.map((event) => (
                <DashboardEvent
                    event={event}
                    key={event.id}
                />
            ))}
        </motion.ul>
    );
};
