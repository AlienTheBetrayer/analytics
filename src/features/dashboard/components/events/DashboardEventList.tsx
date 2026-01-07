"use client";
import { Event } from "@/types/tables/project";
import { DashboardEvent } from "./DashboardEvent";
import { useAppStore } from "@/zustand/store";

type Props = {
    events?: Event[];
    scrollRef: React.RefObject<HTMLUListElement | null>;
};

export const DashboardEventList = ({ events, scrollRef }: Props) => {
    // zustand state
    const eventFilters = useAppStore(state => state.eventFilters);

    return (
        <ul
            ref={scrollRef}
            className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {events &&
                [...events].reverse().map((event) => (
                    event.type && eventFilters[event.type] !== false &&
                    <DashboardEvent
                        event={event}
                        key={event.id}
                    />
                ))}
        </ul>
    );
};
