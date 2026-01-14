import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useNotificationList } from "@/features/notifications/hooks/useNotificationList";
import { useAppStore } from "@/zustand/store";
import { AbsentNotifications } from "../errors/AbsentNotifications";
import { NotificationCompact } from "../parts/NotificationCompact";
import { NotificationTab } from "@/types/other/notifications";

type Props = {
    tab: NotificationTab;
};

export const TabDisplay = ({ tab }: Props) => {
    // zustand
    const notifications = useAppStore((state) => state.notifications)[tab];
    const expandedTab = useAppStore((state) => state.expandedTabs)[tab];

    // notification data
    const { filtered } = useNotificationList(tab);
    const [pagination, setPagination] = useState<number>(0);

    if (!Object.keys(notifications).length) {
        return <AbsentNotifications />;
    }

    const paginatedFiltered = filtered?.slice(0, 4 * (pagination + 1));

    return (
        <ul
            className="flex flex-col gap-2 transition-all duration-500 overflow-hidden"
            style={{
                height: expandedTab ? "auto" : "0px",
                interpolateSize: "allow-keywords",
            }}
        >
            {paginatedFiltered?.map(
                (notification) =>
                    notification && (
                        <li key={notification.id}>
                            <NotificationCompact notification={notification} />
                            <hr className="my-4" />
                        </li>
                    )
            )}

            {(filtered?.length ?? 0) > 4 * (pagination + 1) && (
                <Button
                    className="p-4!"
                    onClick={() => {
                        setPagination((prev) => prev + 1);
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/reload.svg"
                    />
                    Load more
                </Button>
            )}
        </ul>
    );
};
