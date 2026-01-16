import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Sorting } from "./Sorting";
import { Search } from "./Search";
import { Wipe } from "./Wipe";
import { Deselect } from "./Deselect";
import { Manipulation } from "./Manipulation";
import { Emulate } from "./Emulate";
import { TabSelection } from "@/utils/other/TabSelection";

export const ProjectTopline = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const projectFilters = useAppStore((state) => state.projectFilters);

    return (
        <ul
            className={`box p-0! gap-1! flex-row! transition-all duration-300 min-h-10 h-10! items-center ${!selectedProjectId ? "opacity-30" : ""}`}
            inert={!selectedProjectId}
        >
            <li
                className="select-none pointer-events-none absolute transition-all duration-300 inset-0 grid place-items-center z-1"
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
                    element={<Sorting />}
                >
                    <Tooltip text="Sort projects">
                        <Button className="aspect-square">
                            <Image
                                alt="sort"
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

                            <TabSelection
                                condition={!!projectFilters?.projectSorting}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/2 bg-background-6" />
            </li>

            <li>
                <Search key={selectedProjectId} />
            </li>

            <ul className="flex items-center gap-1 ml-auto! h-full">
                <li>
                    <Deselect />
                </li>

                <li className="self-stretch flex items-center">
                    <hr className="w-px! h-1/2 bg-background-6" />
                </li>

                <li>
                    <Emulate />
                </li>

                <li>
                    <Manipulation />
                </li>

                <li>
                    <Wipe />
                </li>
            </ul>
        </ul>
    );
};
