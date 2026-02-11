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
        <div className="relative box p-4! gap-4! acrylic w-screen max-w-lg">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/filter.svg"
                    width={16}
                    height={16}
                />
                Filtering
            </span>

            <div className="grid grid-flow-col gap-2">
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
            <div className="grid grid-cols-2 gap-2">
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
                            src="/delete.svg"
                            width={14}
                            height={14}
                        />
                    </small>
                    Hide all
                </Button>
            </div>
        </div>
    );
};
