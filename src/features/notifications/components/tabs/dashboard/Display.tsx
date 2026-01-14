import { AbsentNotifications } from "../../errors/AbsentNotifications";
import { useLocalStore } from "@/zustand/localStore";
import { useDashboardList } from "@/features/notifications/hooks/useDashboardList";
import { NotificationCompact } from "../../parts/NotificationCompact";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

export const Display = () => {
    // zustand
    const notifications = useLocalStore((state) => state.notifications);
    const collapsedTabs = useLocalStore((state) => state.collapsedTabs);

    // notification data
    const data = notifications.dashboard;
    const { filtered } = useDashboardList();
    const [pagination, setPagination] = useState<number>(0);

    if (!Object.keys(data).length) {
        return <AbsentNotifications />;
    }

    const paginatedFiltered = filtered?.slice(0, 4 * (pagination + 1));

    return (
        <ul
            className="flex flex-col gap-2 transition-all duration-500 overflow-hidden"
            style={{
                height: collapsedTabs.dashboard ? "auto" : "0px",
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
