import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Sorting = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const eventFilters = useAppStore((state) => state.eventFilters);
    const setFilter = useAppStore((state) => state.setDashboardFilter);

    // fallback
    if (!selectedProjectId) {
        return null;
    }

    return (
        <div className="relative box p-4! acrylic gap-4! w-full">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/sort.svg"
                    width={16}
                    height={16}
                />
                Sorting
            </span>

            <hr />
            <div className="flex gap-2">
                <Tooltip
                    className="w-full"
                    direction="top"
                    text="Column to sort by"
                >
                    <Select
                        items={["Type", "Description", "Created Date"]}
                        value={
                            eventFilters[selectedProjectId]?.eventsSorting
                                ?.column ?? "Created Date"
                        }
                        onChange={(item) => {
                            setFilter({
                                project_id: selectedProjectId,
                                type: "event-sort",
                                column: [item],
                            });
                        }}
                    />
                </Tooltip>

                <Tooltip
                    direction="top"
                    text={
                        eventFilters[selectedProjectId]?.eventsSorting
                            ?.direction === "ascendant"
                            ? "Ascendant"
                            : "Descendant"
                    }
                >
                    <Button
                        className="aspect-square p-0!"
                        onClick={() => {
                            setFilter({
                                project_id: selectedProjectId,
                                type: "event-sort",
                                direction:
                                    eventFilters[selectedProjectId]
                                        ?.eventsSorting?.direction ===
                                    "ascendant"
                                        ? "descendant"
                                        : "ascendant",
                            });
                        }}
                    >
                        <Image
                            alt=""
                            src="/sort.svg"
                            width={16}
                            height={16}
                            className="duration-500! ease-out!"
                            style={{
                                transform:
                                    eventFilters[selectedProjectId]
                                        ?.eventsSorting?.direction ===
                                    "ascendant"
                                        ? `rotate(180deg)`
                                        : `rotate(0deg)`,
                            }}
                        />
                    </Button>
                </Tooltip>
            </div>
            <hr />

            <div className="flex w-full">
                <Tooltip
                    text="Remove sorting filters"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                type: "event-sort",
                                project_id: selectedProjectId,
                                column: ["Created Date"],
                                direction: "descendant",
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
                        Undo sorting
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
