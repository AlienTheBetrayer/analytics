import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Select } from "@/features/ui/select/components/Select";
import { ProjectColumns } from "@/types/zustand/dashboard";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Sorting = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const projectFilters = useAppStore((state) => state.projectFilters);
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
                        items={["Name", "Created Date", "Updated Date"]}
                        value={
                            projectFilters?.projectSorting?.column ??
                            "Created Date"
                        }
                        onChange={(item) => {
                            setFilter({
                                project_id: selectedProjectId,
                                type: "project-sort",
                                column: [item as ProjectColumns],
                            });
                        }}
                    />
                </Tooltip>

                <Tooltip
                    direction="top"
                    text={
                        projectFilters?.projectSorting?.direction ===
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
                                type: "project-sort",
                                direction:
                                    projectFilters?.projectSorting
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
                                    projectFilters?.projectSorting
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
                    text="Remove sorting filters"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                type: "project-sort",
                                project_id: selectedProjectId,
                                column: ["Created Date"],
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
