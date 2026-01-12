import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { useState } from "react";
import { FilterSelector } from "../../FilterSelector";

export type FilterTabType = "Status" | "Type" | "Title";

export const Filter = () => {
    // zustand
    const accountFilter = useLocalStore((state) => state.accountFilter);
    const setFilter = useLocalStore((state) => state.setFilter);

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

            <div className="flex gap-1 items-center">
                {["Status", "Type", "Title"].map((type) => (
                    <Checkbox
                        key={type}
                        onToggle={() => {
                            setFilterTab(type as "Status" | "Type" | "Title");
                        }}
                        value={filterTab === type}
                    >
                        <span>{type}</span>
                    </Checkbox>
                ))}
            </div>

            <hr />
            <FilterSelector
                tab={filterTab}
                notificationTab="Account"
            />

            <hr />
            <div className="grid grid-cols-2 gap-1">
                <Tooltip
                    text="Show all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            const keys =
                                accountFilter.filtering &&
                                Object.keys(accountFilter.filtering);

                            if (!keys) {
                                return;
                            }

                            setFilter({
                                column: keys,
                                flag: true,
                                type: "account-filter",
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
                    text="Hide all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            const keys =
                                accountFilter.filtering &&
                                Object.keys(accountFilter.filtering);

                            if (!keys) {
                                return;
                            }

                            setFilter({
                                column: keys,
                                flag: false,
                                type: "account-filter",
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
