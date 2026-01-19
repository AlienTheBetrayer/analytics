import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { Filter } from "./Filter";
import { Sort } from "./Sort";
import { Search } from "./Search";
import { dotColors } from "@/utils/other/dotColors";
import { useMemo } from "react";
import { TabSelection } from "@/utils/other/TabSelection";
import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { usePopup } from "@/features/ui/popup/hooks/usePopup";
import { NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";

type Props = {
    tab: NotificationTab;
};

export const Topline = ({ tab }: Props) => {
    // zustand
    const filter = useAppStore((state) => state.filter)[tab];
    const notifications = useAppStore((state) => state.notifications)[tab];
    const isExpanded = useAppStore((state) => state.expandedTabs)[tab];

    // zusatnd functions
    const toggleCollapsed = useAppStore((state) => state.toggleCollapsed);
    const clearData = useAppStore((state) => state.clearData);

    // ui states
    const hasNotification = !!Object.keys(notifications).length;

    const messageBox = usePopup(({ hide }) => (
        <MessageBox
            description="Deleting will clear all the notifications that you had on this specific tab"
            onInteract={(res) => {
                hide();

                if (res === "no") {
                    return;
                }

                clearData({
                    id: Object.values(notifications).map((n) => n.id),
                    type: "notifications",
                    tab,
                });
                clearData({ type: "filters", tab });
            }}
        />
    ));

    const filterColor = useMemo(() => {
        return dotColors(filter.filtering);
    }, [filter]);

    return (
        <ul
            className={`box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center ${!hasNotification ? "opacity-30" : ""}`}
            inert={!hasNotification}
        >
            {messageBox.render()}

            <li
                className="select-none pointer-events-none transition-all duration-300 absolute inset-0 grid place-items-center z-1"
                style={{ opacity: hasNotification ? 0 : 1 }}
            >
                <span>
                    <mark>Fetch</mark> notifications to access
                </span>
            </li>

            <li>
                <Tooltip text={`${!isExpanded ? "Expand" : "Collapse"}`}>
                    <Button
                        className="aspect-square p-0!"
                        onClick={() => {
                            toggleCollapsed({ tab });
                        }}
                    >
                        <Image
                            alt="expand"
                            src="/collapse.svg"
                            width={24}
                            height={24}
                        />

                        <TabSelection
                            condition={!isExpanded}
                            color="var(--orange-1)"
                        />
                    </Button>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3! bg-background-6" />
            </li>

            <li>
                <Modal
                    direction="bottom-right"
                    element={() => <Filter tab={tab} />}
                >
                    <Tooltip text="Filter notifications">
                        <Button className="aspect-square">
                            <Image
                                alt="filter"
                                src="/filter.svg"
                                width={16}
                                height={16}
                            />

                            <TabSelection
                                condition={true}
                                color={filterColor}
                            />
                        </Button>
                    </Tooltip>
                </Modal>
            </li>

            <li>
                <Modal
                    direction="bottom-right"
                    element={() => <Sort tab={tab} />}
                >
                    <Tooltip text="Sort notifications">
                        <Button className="aspect-square">
                            <Image
                                alt="sort"
                                src="/sort.svg"
                                width={16}
                                height={16}
                                className="duration-500! ease-out!"
                                style={{
                                    transform:
                                        filter.sorting.direction === "ascendant"
                                            ? `rotate(180deg)`
                                            : `rotate(0deg)`,
                                }}
                            />

                            <TabSelection
                                condition={!!filter.sorting}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </Modal>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3! bg-background-6" />
            </li>

            <li>
                <Search tab={tab} />
            </li>

            <li className="ml-auto!">
                <Tooltip text="Wipe all notifications on this tab">
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
            </li>
        </ul>
    );
};
