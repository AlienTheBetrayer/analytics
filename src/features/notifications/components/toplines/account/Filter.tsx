import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { FilterColumn } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { useMemo } from "react";

export const Filter = () => {
    // zustand-state
    const notifications = useLocalStore((state) => state.notifications);
    const accountFilter = useLocalStore((state) => state.accountFilter);
    const setFilter = useLocalStore((state) => state.setFilter);

    const notificationCount = useMemo(() => {
        const count: Record<string, number> = {};
        for (const notification of Object.values(notifications.account)) {
            count[notification.status] = (count[notification.status] ?? 0) + 1;
        }

        return count;
    }, [notifications]);

    return (
        <div className="box p-3! min-w-81">
            <span className="flex flex-col items-center">
                <Image
                    alt="filter"
                    src="/filter.svg"
                    width={16}
                    height={16}
                />
                Type filtering
            </span>

            <hr />
            {["Error", "Warning", "Information"].map((type) => (
                <Checkbox
                    key={type}
                    onToggle={(flag) => {
                        setFilter({
                            type: "account-filter",
                            column: [type as FilterColumn],
                            flag,
                        });
                    }}
                    value={accountFilter.filtering?.[type]}
                >
                    <span>{type}</span>
                    <span className="ml-auto">
                        <small>{notificationCount[type] ?? 0}</small>
                    </span>
                </Checkbox>
            ))}

            <hr />
            <div className="grid grid-cols-2 gap-1">
                <Tooltip
                    text="Show all events"
                    className="w-full"
                >
                    <Button
                        className="w-full"
                        onClick={() => {
                            setFilter({
                                column: ["Error", "Information", "Warning"],
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
                            setFilter({
                                column: ["Error", "Information", "Warning"],
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
