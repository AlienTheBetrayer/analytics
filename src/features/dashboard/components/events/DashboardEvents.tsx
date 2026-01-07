import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useAppStore } from "@/zustand/store";
import { DashboardEventList } from "./DashboardEventList";
import { DashboardScrollTop } from "./DashboardScrollTop";
import { EventTopline } from "../topline/events/EventTopline";

export const DashboardEvents = () => {
    // zustand
    const events = useAppStore((state) => state.events);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // scroll
    const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
    const scroll = useScroll<HTMLUListElement>((value) => {
        setHasScrolledEnough(value > 0.5);
    });

    return (
        <div className="flex flex-col gap-4 max-h-256 relative">
            <hr className="block! lg:hidden!" />

            <EventTopline />

            <hr/>

            {!events[selectedProjectId ?? ""]?.length ? (
                <div className="flex flex-col gap-4 mt-24 relative">
                    <span className="m-auto">
                        No events so far. Try re-fetching
                    </span>
                    <span className="m-auto absolute text-[14rem]! left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <small>?</small>
                    </span>
                </div>
            ) : selectedProjectId ? (
                <>
                    <DashboardEventList scrollRef={scroll.ref} />
                    <DashboardScrollTop
                        isVisible={hasScrolledEnough}
                        scrollRef={scroll.ref}
                    />
                </>
            ) : (
                <div className="flex flex-col gap-4 h-64 max-h-64 relative">
                    <span className="m-auto">
                        Select a project to see events.
                    </span>
                </div>
            )}
        </div>
    );
};
