import { Notification } from "@/types/other/notifications";
import { AbsentNotification } from "../../errors/AbsentNotification";
import { NotificationCompact } from "../../parts/NotificationCompact";

type Props = {
    data: Notification | undefined;
};

export const Display = ({ data }: Props) => {
    // fallbacks
    if (!data) {
        return <AbsentNotification />;
    }

    return (
        <div className="flex flex-col gap-2">
            <NotificationCompact
                notification={data}
                buttonClassName="p-20!"
            />
            <hr className="my-4" />
        </div>
    );
};
