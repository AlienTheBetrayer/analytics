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

export const ProjectTopline = () => {
    // zustand-state
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const projectFilters = useAppStore((state) => state.projectFilters);

    return (
        <div
            className={`box p-0! gap-1! flex-row! transition-all duration-500 h-10 items-center ${!selectedProjectId ? "opacity-30" : ""}`}
            inert={!selectedProjectId}
        >
            <div
                className="select-none pointer-events-none absolute transition-all duration-500 inset-0 grid place-items-center z-1"
                style={{ opacity: selectedProjectId ? 0 : 1 }}
            >
                <span>
                    <mark>Select</mark> a project to access
                </span>
            </div>

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Sorting />}
            >
                <Tooltip
                    text="Sort projects"
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
                                    projectFilters?.projectSorting
                                        ?.direction === "ascendant"
                                        ? `rotate(180deg)`
                                        : `rotate(0deg)`,
                            }}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: projectFilters?.projectSorting
                                    ? "var(--blue-1)"
                                    : "transparent",
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <Search key={selectedProjectId} />

            <div className="flex items-center gap-1 ml-auto">
                <Emulate/>
                <Manipulation />
                <Deselect />
                <Wipe />
            </div>
        </div>
    );
};
