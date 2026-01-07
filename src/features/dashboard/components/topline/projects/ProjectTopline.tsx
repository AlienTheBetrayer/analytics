import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Event } from "@/types/tables/project";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";
import { Input } from "@/features/ui/input/components/Input";
import { Sorting } from "./Sorting";

export const ProjectTopline = () => {


    return (
        <div className="box p-0! flex-row! items-center">
            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Sorting/>}
            >
                <Tooltip
                    text="Sort events"
                    direction="top"
                >
                    <Button>
                        <Image
                            alt="sort"
                            src="/sort.svg"
                            width={16}
                            height={16}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: hasFiltered
                                    ? "var(--blue-1)"
                                    : "transparent",
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <Tooltip
                direction="top"
                text="Filters every field"
            >
                <Input
                    className="rounded-full!"
                    placeholder="Search..."
                />
            </Tooltip>

            <Tooltip
                className="ml-auto"
                text="Wipe all events"
                direction="top"
            >
                <Button className="text-6!">
                    <Image
                        alt="delete"
                        src="/delete.svg"
                        width={16}
                        height={16}
                    />
                </Button>
            </Tooltip>
        </div>
    );
};
