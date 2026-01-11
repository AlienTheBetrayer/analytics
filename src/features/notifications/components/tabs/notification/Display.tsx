import { DashboardNotification } from "@/types/zustand/local";
import { AbsentNotification } from "../../errors/AbsentNotification";
import { NotificationCompact } from "../../parts/NotificationCompact";

type Props = {
    data: DashboardNotification | undefined;
};

export const Display = ({ data }: Props) => {
    if (!data) {
        return <AbsentNotification />;
    }

    return (
        <div className="flex flex-col gap-2">
            <NotificationCompact notification={data} />
            <hr className="my-4" />
        </div>
    );
};
