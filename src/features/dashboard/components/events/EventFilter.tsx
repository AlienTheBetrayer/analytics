import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Event } from "@/types/tables/project";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    data: { events: Event[] };
};

export const EventFilter = ({ data }: Props) => {
    // zustand-state
    const eventFilters = useAppStore((state) => state.eventFilters);

    // zustand functions
    const setEventFilters = useAppStore((state) => state.setEventFilters);

    // state-derived
    const eventTypes = useMemo(
        () => [
            ...new Set(
                data.events.map((e) => e.type).filter(Boolean) as string[]
            ),
        ],
        [data]
    );

    // ui states
    const hasFiltered = useMemo(() => {
        for (const filter of Object.keys(eventFilters)) {
            if (eventTypes.includes(filter)) {
                return true;
            }
        }

        return false;
    }, [eventTypes, eventFilters]);

    return (
        <div className="box p-0!">
            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={
                    <div className="box p-3! min-w-48">
                        <span>
                            <small className="flex gap-1">
                                <Image
                                    alt="filter"
                                    src="/type.svg"
                                    width={16}
                                    height={16}
                                />
                                Event visibility
                            </small>
                        </span>
                        <hr />
                        {eventTypes.map((event) => (
                            <Checkbox
                                key={event}
                                onToggle={(flag) => {
                                    setEventFilters({ events: [event], flag });
                                }}
                                value={eventFilters[event] ?? true}
                            >
                                {event}
                            </Checkbox>
                        ))}
                        <hr />
                        <div className="grid grid-cols-2 gap-1">
                            <Tooltip text="Show all events">
                                <Button
                                    onClick={() => {
                                        setEventFilters({
                                            events: eventTypes,
                                            flag: true,
                                        });
                                    }}
                                >
                                    <small>
                                        <Image
                                            alt=""
                                            src="/eye.svg"
                                            width={16}
                                            height={16}
                                        />
                                    </small>
                                    Show all
                                </Button>
                            </Tooltip>

                            <Tooltip text="Hide all events">
                                <Button
                                    onClick={() => {
                                        setEventFilters({
                                            events: eventTypes,
                                            flag: false,
                                        });
                                    }}
                                >
                                    <small>
                                        <Image
                                            alt=""
                                            src="/prohibited.svg"
                                            width={14}
                                            height={14}
                                        />
                                    </small>
                                    Hide all
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                }
            >
                <Tooltip
                    text="Filter events"
                    direction="top"
                >
                    <Button>
                        <Image
                            alt="filter"
                            src="/filter.svg"
                            width={16}
                            height={16}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1"
                            style={{
                                background: hasFiltered ? "var(--blue-1)" : "transparent"
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>
        </div>
    );
};
