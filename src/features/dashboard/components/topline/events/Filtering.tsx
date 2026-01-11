import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";

export const Filtering = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const events = useAppStore((state) => state.events);
    const eventFilters = useAppStore((state) => state.eventFilters);
    const setFilter = useAppStore((state) => state.setFilter);

    const eventsCount = useMemo(() => {
        if (!selectedProjectId) {
            return;
        }

        const count: Record<string, number> = {};
        for (const event of events[selectedProjectId]) {
            if (event.type) {
                count[event.type] = (count[event.type] ?? 0) + 1;
            }
        }

        return count;
    }, [events, selectedProjectId]);

    if (!selectedProjectId) {
        return null;
    }

    const uniqueEventTypes = Array.from(
        new Set<string>(
            events[selectedProjectId]
                .map((e) => e.type)
                .filter(Boolean) as string[]
        )
    );

    return (
        <div className="box p-3! min-w-81">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/filter.svg"
                    width={16}
                    height={16}
                />
                Type filtering
            </span>
            <hr />
            {uniqueEventTypes.map((type) => (
                <Checkbox
                    key={type}
                    onToggle={(flag) => {
                        setFilter({
                            project_id: selectedProjectId,
                            column: [type],
                            flag,
                            type: "event-filter",
                        });
                    }}
                    value={
                        eventFilters[selectedProjectId]?.eventsFiltering?.[type]
                    }
                >
                    <span>{type}</span>

                    <span className="ml-auto">
                        <small>{eventsCount?.[type] ?? 0}</small>
                    </span>
                </Checkbox>
            ))}
            <hr />
            <div className="grid grid-cols-2 gap-1">
                <Tooltip
                    text="Show all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                project_id: selectedProjectId,
                                column: uniqueEventTypes,
                                flag: true,
                                type: "event-filter",
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

                <Tooltip
                    text="Hide all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                project_id: selectedProjectId,
                                column: uniqueEventTypes,
                                flag: false,
                                type: "event-filter",
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
    );
};
