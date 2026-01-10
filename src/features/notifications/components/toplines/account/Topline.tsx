import { Filtering } from "@/features/dashboard/components/topline/events/Filtering";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

export const Topline = () => {
    return (
        <div className="box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center">
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
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-300"
                            // style={{
                            //     background: eventFilters[
                            //         selectedProjectId ?? ""
                            //     ]?.eventsFiltering
                            //         ? "var(--blue-1)"
                            //         : "transparent",
                            // }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>
        </div>
    );
};
