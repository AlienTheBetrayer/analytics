import { Filtering } from "@/features/dashboard/components/topline/events/Filtering";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { DashboardNotification } from "@/types/zustand/local";
import Image from "next/image";

type Props = {
    data: DashboardNotification | undefined;
};

export const Topline = ({ data }: Props) => {
    return (
        <div
            className={`box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center ${!data ? "opacity-30" : ""}`}
            inert={!data}
        >
            <div
                className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500"
                style={{ opacity: !data ? 0 : 1 }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/notification.svg"
                />
                <span>Notification</span>
            </div>

            <div
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: data ? 0 : 1 }}
            >
                <span>
                    <mark>Select</mark> an existing notification to access
                </span>
            </div>

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
