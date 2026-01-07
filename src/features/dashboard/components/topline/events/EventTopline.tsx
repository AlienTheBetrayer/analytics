import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Sorting } from "./Sorting";
import { Filtering } from "./Filtering";
import { Search } from "./Search";
import { Wipe } from "./Wipe";

export const EventTopline = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const filter = useAppStore((state) => state.filter);

    return (
        <div
            className={`box p-0! gap-1! flex-row! items-center ${!selectedProjectId ? "opacity-30" : ""}`}
            inert={!selectedProjectId}
        >
            {!selectedProjectId && (
                <div className="select-none pointer-events-none absolute inset-0 grid place-items-center z-1">
                    <span>
                        <mark>Select</mark> a project to access
                    </span>
                </div>
            )}

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Filtering />}
            >
                <Tooltip
                    text="Filter events"
                    direction="top"
                >
                    <Button className="aspect-square">
                        <Image
                            alt="filter"
                            src="/filter.svg"
                            width={16}
                            height={16}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: filter[selectedProjectId ?? ""]
                                    ?.eventsFiltering
                                    ? "var(--blue-1)"
                                    : "transparent",
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Sorting />}
            >
                <Tooltip
                    text="Sort events"
                    direction="top"
                >
                    <Button className="aspect-square">
                        <Image
                            alt="sort"
                            src="/sort.svg"
                            width={16}
                            height={16}
                            className="duration-500! ease-out!"
                            style={{
                                transform:
                                    filter[selectedProjectId ?? ""]?.eventsSorting
                                        ?.direction === "ascendant"
                                        ? `rotate(180deg)`
                                        : `rotate(0deg)`,
                            }}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: filter[selectedProjectId ?? ""]
                                    ?.eventsSorting
                                    ? "var(--blue-1)"
                                    : "transparent",
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>
            <Search key={selectedProjectId} />

            <Wipe />
        </div>
    );
};
