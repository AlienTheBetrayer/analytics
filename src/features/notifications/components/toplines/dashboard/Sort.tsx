import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { FilterColumn } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const Sort = () => {
    // zustand-state
    const dashboardFilter = useLocalStore((state) => state.dashboardFilter);
    const setFilter = useLocalStore((state) => state.setFilter);

    return (
        <div className="box p-3! min-w-81">
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
                        items={["Title", "Description", "Status", "Sent Date"]}
                        value={dashboardFilter.sorting?.column ?? "Status"}
                        onChange={(item) => {
                            setFilter({
                                type: "dashboard-sort",
                                column: [item as FilterColumn],
                            });
                        }}
                    />
                </Tooltip>

                <Tooltip
                    direction="top"
                    text={
                        dashboardFilter?.sorting?.direction === "ascendant"
                            ? "Ascendant"
                            : "Descendant"
                    }
                >
                    <Button
                        className="aspect-square p-0!"
                        onClick={() => {
                            setFilter({
                                type: "dashboard-sort",
                                direction:
                                    dashboardFilter?.sorting?.direction ===
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
                                    dashboardFilter?.sorting?.direction ===
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
                                type: "dashboard-sort",
                                column: ["Sent Date"],
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
