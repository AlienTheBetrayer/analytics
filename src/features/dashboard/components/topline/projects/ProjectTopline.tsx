import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { Sorting } from "./Sorting";
import { Search } from "./Search";
import { Wipe } from "./Wipe";
import { Manipulation } from "./Manipulation";
import { Emulate } from "./Emulate";
import { TabSelection } from "@/utils/other/TabSelection";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useQuery } from "@/query/core";

export const ProjectTopline = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const projectFilters = useAppStore((state) => state.projectFilters);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <ul
            className={`box p-0! gap-1! sticky! top-16 z-2 bg-background-3! flex-row! transition-all duration-300 min-h-10 h-10! items-center ${!selectedProjectId ? "opacity-30" : ""}`}
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
                <Modal
                    direction="bottom-right"
                    element={(hide) => <Sorting hide={hide} />}
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
                </Modal>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3 bg-background-6" />
            </li>

            <li>
                <Search key={selectedProjectId} />
            </li>

            <li className="ml-auto!">
                <ul className="flex items-center gap-1 h-full">
                    <li>
                        <Emulate />
                    </li>

                    <li
                        inert={status?.role === "user"}
                        className={`${status?.role === "user" ? "opacity-30" : ""}`}
                    >
                        <Manipulation />
                    </li>

                    <li
                        inert={status?.role === "user"}
                        className={`${status?.role === "user" ? "opacity-30" : ""}`}
                    >
                        <Wipe />
                    </li>
                </ul>
            </li>
        </ul>
    );
};
