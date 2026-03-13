import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { DashboardScrollTop } from "./DashboardScrollTop";
import { DashboardEvent } from "@/features/dashboard/components/events/DashboardEvent";
import { useEventList } from "@/features/dashboard/hooks/useEventList";
import { motion } from "motion/react";
import { NoEvents } from "@/features/dashboard/components/errors/NoEvents";
import { useQuery } from "@/query/core";
import { Spinner } from "@/features/ui/spinner/components/Spinner";

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
                className="w-full h-16 loading rounded-full! relative"
            >
                <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
            </div>
        ));
    }

    if (!filteredEvents?.length) {
        return (
            <div className="rounded-4xl loading p-4! grow items-center justify-center flex">
                <NoEvents />
            </div>
        );
    }

    return (
        <>
            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                ref={ref}
                className="box grow bg-bg-2! p-4! border-0! h-full overflow-y-auto overflow-x-hidden"
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
