import "./DashboardEvent.css";

import Image from "next/image";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { relativeTime } from "@/utils/other/relativeTime";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/other/status";
import { Event } from "@/types/tables/project";

type Props = {
    event: Event;
};

export const DashboardEvent = ({ event }: Props) => {
    // zustand state
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);

    // zustand functions
    const deleteData = useAppStore((state) => state.deleteData);

    return (
        <Tooltip
            text={event.description ?? "No description"}
            title={event.type}
            className="w-full"
            direction="top"
        >
            <li
                className="sm:h-16 dashboard-event relative gap-3 rounded-3xl
            border-2 border-background-4 
            px-4! py-2! hover:bg-background-4 transition-all"
            >
                <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
                    <span
                        className={`text-5xl! opacity-30 transition-all duration-300 ease-out`}
                    >
                        {event.type && (
                            <small>{event.type[0].toUpperCase()}</small>
                        )}
                    </span>
                </div>

                <EventProperty
                    eventType="Type"
                    value={event.type}
                    image="/type.svg"
                />
                <EventProperty
                    eventType="Description"
                    value={event.description}
                    image="/description.svg"
                />
                <EventProperty
                    eventType="Date"
                    value={relativeTime(event.created_at)}
                    image="/calendar.svg"
                />

                <Tooltip
                    text="Delete this event"
                    className="w-full"
                    direction="left"
                    isEnabled={status?.role !== "user"}
                >
                    <Button
                        aria-label="delete event"
                        isEnabled={status?.role !== "user"}
                        className="w-full"
                        onClick={() => {
                            deleteData({
                                id: [event.id],
                                type: "event",
                                promiseKey: `eventDelete_${event.id}`,
                            });
                        }}
                    >
                        {promiseStatus(promises[`eventDelete_${event.id}`])}
                        <Image
                            width={16}
                            height={16}
                            alt="delete"
                            src="/delete.svg"
                        />
                    </Button>
                </Tooltip>
            </li>
        </Tooltip>
    );
};

type PropertyProps = {
    eventType: string;
    value?: string;
    className?: string;
    image?: string;
};

const EventProperty = ({
    eventType,
    value,
    image,
    className,
}: PropertyProps) => {
    return (
        <div
            className={`dashboard-event-element flex flex-col ${className ?? ""}`}
        >
            <span>
                <small className="flex items-center gap-1">
                    {image && (
                        <Image
                            alt=""
                            src={image}
                            width={16}
                            height={16}
                        />
                    )}
                    {eventType}
                </small>
            </span>
            {value ? (
                <span>{value}</span>
            ) : (
                <span>
                    <small>None</small>
                </span>
            )}
        </div>
    );
};
