import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useState } from "react";
import { FilterSelector } from "./FilterSelector";
import { TabSelection } from "@/utils/other/TabSelection";
import { NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";

export type FilterTabType = "Status" | "Type" | "Title";

const FilterImage = {
    Status: "/auth.svg",
    Type: "/cubes.svg",
    Title: "/cube.svg",
};

type Props = {
    tab: NotificationTab;
};

export const Filter = ({ tab }: Props) => {
    // zustand
    const filter = useAppStore((state) => state.filter)[tab];
    const setNotificationFilter = useAppStore(
        (state) => state.setNotificationFilter,
    );

    // react states
    const [filterTab, setFilterTab] = useState<FilterTabType>("Status");

    return (
        <div className="box p-3! min-w-81">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/filter.svg"
                    width={16}
                    height={16}
                />
                Filtering
            </span>

            <div className="grid grid-flow-col gap-1">
                {["Status", "Type", "Title"].map((type) => (
                    <Button
                        key={type}
                        onClick={() => {
                            setFilterTab(type as "Status" | "Type" | "Title");
                        }}
                    >
                        <Image
                            alt="filter"
                            src={FilterImage[type as keyof typeof FilterImage]}
                            width={16}
                            height={16}
                        />
                        <span>{type}</span>
                        <TabSelection
                            condition={type === filterTab}
                            color="var(--blue-1)"
                        />
                    </Button>
                ))}
            </div>

            <hr />
            <FilterSelector
                tab={filterTab}
                notificationTab={tab}
            />

            <hr />
            <div className="grid grid-cols-2 gap-1">
                <Tooltip
                    text="Show all notifications"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            const keys = Object.keys(filter.filtering ?? {});

                            if (!keys.length) {
                                return;
                            }

                            setNotificationFilter({
                                column: keys,
                                flag: true,
                                tab,
                                type: "filter",
                            });
                        }}
                    >
                        <small>
                            <Image
                                alt=""
                                src="/eye.svg"
                                width={16}
                                height={16}
                            />
                        </small>
                        Show all
                    </Button>
                </Tooltip>

                <Tooltip
                    text="Hide all notifications"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            const keys = Object.keys(filter.filtering ?? {});

                            if (!keys.length) {
                                return;
                            }

                            setNotificationFilter({
                                column: keys,
                                flag: false,
                                tab,
                                type: "filter",
                            });
                        }}
                    >
                        <small>
                            <Image
                                alt=""
                                src="/prohibited.svg"
                                width={14}
                                height={14}
                            />
                        </small>
                        Hide all
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
