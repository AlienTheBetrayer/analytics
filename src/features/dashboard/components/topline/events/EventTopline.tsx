import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Sorting } from "./Sorting";
import { Filtering } from "./Filtering";
import { Search } from "./Search";
import { Wipe } from "./Wipe";
import { useMemo } from "react";
import { dotColors } from "@/utils/other/dotColors";
import { TabSelection } from "@/utils/other/TabSelection";

export const EventTopline = () => {
    // zustand-state
    const status = useAppStore((state) => state.status);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const eventFilters = useAppStore((state) => state.eventFilters);

    const filterColor = useMemo(() => {
        if (!selectedProjectId) {
            return "transparent";
        }
        return dotColors(eventFilters[selectedProjectId]?.eventsFiltering);
    }, [eventFilters, selectedProjectId]);

    return (
        <ul
            className={`box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center ${!selectedProjectId ? "opacity-30" : ""}`}
            inert={!selectedProjectId}
        >
            <li
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: selectedProjectId ? 0 : 1 }}
            >
                <span>
                    <mark>Select</mark> a project to access
                </span>
            </li>

            <li>
                <Tooltip
                    disabledPointer={false}
                    type="modal"
                    direction="bottom-right"
                    element={<Filtering />}
                >
                    <Tooltip text="Filter events">
                        <Button className="aspect-square">
                            <Image
                                alt="filter"
                                src="/filter.svg"
                                width={16}
                                height={16}
                            />

                            <TabSelection
                                condition={true}
                                color={filterColor}
                            />
                        </Button>
                    </Tooltip>
                </Tooltip>
            </li>

            <li>
                <Tooltip
                    disabledPointer={false}
                    type="modal"
                    direction="bottom-right"
                    element={<Sorting />}
                >
                    <Tooltip text="Sort events">
                        <Button className="aspect-square">
                            <Image
                                alt="sort"
                                src="/sort.svg"
                                width={16}
                                height={16}
                                className="duration-500! ease-out!"
                                style={{
                                    transform:
                                        eventFilters[selectedProjectId ?? ""]
                                            ?.eventsSorting?.direction ===
                                        "ascendant"
                                            ? `rotate(180deg)`
                                            : `rotate(0deg)`,
                                }}
                            />

                            <TabSelection
                                condition={
                                    !!eventFilters[selectedProjectId ?? ""]
                                        ?.eventsSorting
                                }
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3 bg-background-6" />
            </li>

            <li>
                <Search key={selectedProjectId} />
            </li>

            <li
                inert={status?.role === "user"}
                className={`ml-auto! ${status?.role === "user" ? "opacity-30" : ""}`}
            >
                <Wipe />
            </li>
        </ul>
    );
};
