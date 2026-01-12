import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { Filter } from "./Filter";
import { Sort } from "./Sort";
import { Search } from "./Search";
import { useTopline } from "@/features/notifications/hooks/useTopline";
import { dotColors } from "@/utils/other/dotColors";
import { useMemo } from "react";

export const Topline = () => {
    // zustand
    const dashboardFilter = useLocalStore((state) => state.dashboardFilter);
    const collapsedTabs = useLocalStore((state) => state.collapsedTabs);
    const notifications = useLocalStore((state) => state.notifications);

    // zustand functions
    const toggleCollapsed = useLocalStore((state) => state.toggleCollapsed);

    const hasNotification = !!Object.keys(notifications.dashboard).length;

    const { messageBox } = useTopline("Dashboard");

    const filterColor = useMemo(() => {
        return dotColors(dashboardFilter.filtering);
    }, [dashboardFilter]);

    return (
        <div
            className={`box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center ${!hasNotification ? "opacity-30" : ""}`}
            inert={!hasNotification}
        >
            {messageBox.render()}

            <div
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: hasNotification ? 0 : 1 }}
            >
                <span>
                    <mark>Fetch</mark> notifications to access
                </span>
            </div>

            <Tooltip
                text={`${!collapsedTabs.dashboard ? "Expand" : "Collapse"}`}
                direction="top"
            >
                <Button
                    className="aspect-square p-0!"
                    onClick={() => {
                        toggleCollapsed({ tab: "Dashboard" });
                    }}
                >
                    <Image
                        alt="expand"
                        src="/collapse.svg"
                        width={24}
                        height={24}
                    />

                    <div
                        className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                        style={{
                            background: !collapsedTabs.dashboard
                                ? "var(--orange-1)"
                                : "transparent",
                        }}
                    />
                </Button>
            </Tooltip>

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Filter />}
            >
                <Tooltip
                    text="Filter dashboard notifications"
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
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: filterColor,
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <Tooltip
                disabledPointer={false}
                type="modal"
                direction="bottom-right"
                element={<Sort />}
            >
                <Tooltip
                    text="Sort dashboard notifications"
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
                                    dashboardFilter?.sorting?.direction ===
                                    "ascendant"
                                        ? `rotate(180deg)`
                                        : `rotate(0deg)`,
                            }}
                        />

                        <div
                            className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500"
                            style={{
                                background: dashboardFilter.sorting
                                    ? "var(--blue-1)"
                                    : "transparent",
                            }}
                        />
                    </Button>
                </Tooltip>
            </Tooltip>

            <hr className="w-px! h-1/2! bg-background-a-11" />
            <Search />

            <Tooltip
                className="ml-auto"
                direction="top"
                text="Wipe all notifications on this tab"
            >
                <Button
                    className="p-0!"
                    onClick={messageBox.show}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/delete.svg"
                    />
                </Button>
            </Tooltip>
        </div>
    );
};
