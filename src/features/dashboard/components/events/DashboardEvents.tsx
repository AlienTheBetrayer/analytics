import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useAppStore } from "@/zustand/store";
import { DashboardEventList } from "./DashboardEventList";
import { DashboardScrollTop } from "./DashboardScrollTop";
import { EventTopline } from "../topline/events/EventTopline";
import { NoEvents } from "../errors/NoEvents";
import { NoProjectSelected } from "../errors/NoProjectSelected";

export const DashboardEvents = () => {
    // zustand
    const events = useAppStore((state) => state.events);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // scroll
    const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
    const scroll = useScroll<HTMLUListElement>((value) => {
        setHasScrolledEnough(value > 0.5);
    });

    if (!selectedProjectId) {
        return (
            <div className="flex flex-col gap-4 max-h-256 relative">
                <hr className="block! lg:hidden!" />
                <EventTopline />

                <NoProjectSelected />
            </div>
        );
    }

    if (!events[selectedProjectId ?? ""]?.length) {
        return (
            <div className="flex flex-col gap-4 max-h-256 relative">
                <hr className="block! lg:hidden!" />
                <EventTopline />

                <NoEvents />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 max-h-256 relative">
            <hr className="block! md:hidden!" />
            <EventTopline />
            <hr />

            <DashboardEventList scrollRef={scroll.ref} />
            <DashboardScrollTop
                isVisible={hasScrolledEnough}
                scrollRef={scroll.ref}
            />
        </div>
    );
};
