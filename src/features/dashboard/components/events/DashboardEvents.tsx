import { useState } from "react";
import { Spinner } from "@/features/spinner/components/Spinner";
import { useScroll } from "@/hooks/useScroll";
import { useAppStore } from "@/zustand/store";
import { DashboardEventList } from "./DashboardEventList";
import { DashboardScrollTop } from "./DashboardScrollTop";
import { EventFilter } from "./EventFilter";

export const DashboardEvents = () => {
    // zustand
    const events = useAppStore((state) => state.events);
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // scroll
    const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
    const scroll = useScroll<HTMLUListElement>((value) => {
        setHasScrolledEnough(value > 0.5);
    });

    // error / empty data handling
    if (!events) return null;

    if (!selectedProjectId) {
        return (
            <div className="flex flex-col gap-4 h-64 max-h-64 relative">
                <span className="m-auto">Select a project to see events.</span>
            </div>
        );
    }

    if (promises[selectedProjectId] === "pending") {
        return (
            <div className="flex flex-col gap-4 h-64 max-h-64 relative">
                <Spinner styles="big" />
            </div>
        );
    }

    if (!events[selectedProjectId]?.length) {
        return (
            <div className="flex flex-col gap-4 h-64 max-h-64 relative">
                <span className="m-auto">No events so far...</span>
                <span className="m-auto absolute text-[14rem]! left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <small>?</small>
                </span>
            </div>
        );
    }

    // state-derived ui states
    const data = { events: events[selectedProjectId] };

    return (
        <div className="flex flex-col gap-4 h-64 max-h-64 relative">
            <hr className="block! lg:hidden!" />

            <EventFilter data={data} />

            <DashboardEventList
                events={data.events}
                scrollRef={scroll.ref}
            />
            <DashboardScrollTop
                isVisible={hasScrolledEnough}
                scrollRef={scroll.ref}
            />
        </div>
    );
};
