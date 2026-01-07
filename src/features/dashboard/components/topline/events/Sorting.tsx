import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

const AvailableTypes = ["Type", "Description", "Date"];

export const Sorting = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const filter = useAppStore((state) => state.filter);
    const setFilter = useAppStore((state) => state.setFilter);

    if (!selectedProjectId) {
        return null;
    }

    return (
        <div className="box p-3! min-w-64">
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
                        items={AvailableTypes}
                        value={
                            filter[selectedProjectId]?.eventsSorting?.column ??
                            "Date"
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
                        filter[selectedProjectId]?.eventsSorting?.direction ===
                        "ascendant"
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
                                    filter[selectedProjectId]?.eventsSorting
                                        ?.direction === "ascendant"
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
                                    filter[selectedProjectId]?.eventsSorting
                                        ?.direction === "ascendant"
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
                    text="Show all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                type: "event-sort",
                                project_id: selectedProjectId,
                                column: ["Date"],
                                direction: "descendant",
                            });
                        }}
                    >
                        <small>
                            <Image
                                alt=""
                                src="/cross.svg"
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
