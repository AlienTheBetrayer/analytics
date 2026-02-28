import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    project_id: string;
};

export const Filtering = ({ project_id }: Props) => {
    // zustand
    const eventFilters = useAppStore((state) => state.eventFilters);
    const setFilter = useAppStore((state) => state.setDashboardFilter);

    // fetching
    const { data } = useQuery({ key: ["events", project_id] });

    // ui states
    const eventsCount = useMemo(() => {
        if (!data) {
            return;
        }

        const count: Record<string, number> = {};
        for (const event of Object.values(data)) {
            if (event.type) {
                count[event.type] = (count[event.type] ?? 0) + 1;
            }
        }

        return count;
    }, [data]);

    const uniqueEventTypes = useMemo(() => {
        if (!data) {
            return;
        }

        return Array.from(
            new Set<string>(
                Object.values(data)
                    .map((e) => e.type)
                    .filter(Boolean) as string[],
            ),
        );
    }, [data]);

    return (
        <div className="relative box p-4! w-full gap-4! acrylic">
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

            <ul className="flex flex-col gap-2">
                {uniqueEventTypes?.map((type) => (
                    <li key={type}>
                        <Checkbox
                            onToggle={(flag) => {
                                setFilter({
                                    project_id,
                                    column: [type],
                                    flag,
                                    type: "event-filter",
                                });
                            }}
                            value={
                                eventFilters[project_id]?.eventsFiltering?.[
                                    type
                                ]
                            }
                        >
                            <span>{type}</span>

                            <span className="ml-auto">
                                <small>{eventsCount?.[type] ?? 0}</small>
                            </span>
                        </Checkbox>
                    </li>
                ))}
            </ul>

            <hr />

            <div className="grid grid-cols-2 gap-1">
                <Button
                    className="w-full"
                    onClick={() => {
                        setFilter({
                            project_id,
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

                <Button
                    className="w-full"
                    onClick={() => {
                        setFilter({
                            project_id,
                            column: uniqueEventTypes,
                            flag: false,
                            type: "event-filter",
                        });
                    }}
                >
                    <small>
                        <Image
                            alt=""
                            src="/delete.svg"
                            width={16}
                            height={16}
                        />
                    </small>
                    Hide all
                </Button>
            </div>
        </div>
    );
};
