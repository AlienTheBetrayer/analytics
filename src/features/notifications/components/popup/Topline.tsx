import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { DashboardNotificationPartial } from "@/types/zustand/local";
import {
    NotificationImages,
    NotificationColors,
} from "../parts/NotificationCompact";
import Image from "next/image";

type Props = {
    notification: DashboardNotificationPartial;
    onInteract?: () => void;
};

export const Topline = ({ notification, onInteract }: Props) => {
    return (
        <div className="box p-0! relative flex flex-row! items-center justify-between border-b border-b-background-a-11">
            <div className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <small>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={`${NotificationImages[notification.status]}`}
                    />
                </small>

                <div
                    className="w-1 h-1 rounded-full"
                    style={{
                        background: NotificationColors[notification.status],
                    }}
                />

                <span>{notification.status}</span>
            </div>

            <Tooltip
                text="Hide"
                className="ml-auto"
            >
                <Button onClick={onInteract}>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/cross.svg"
                    />
                </Button>
            </Tooltip>
        </div>
    );
};
