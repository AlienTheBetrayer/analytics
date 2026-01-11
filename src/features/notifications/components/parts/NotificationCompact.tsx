import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { DashboardNotification } from "@/types/zustand/local";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    notification: DashboardNotification;
};

const NotificationImages = {
    Error: "/prohibited.svg",
    Warning: "/warning.svg",
    Information: "/information.svg",
};

const NotificationColors = {
    Error: "var(--red-1)",
    Warning: "var(--orange-1)",
    Information: "var(--blue-1)",
};

export const NotificationCompact = ({ notification }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <div
                className={`box w-full max-w-7xl  justify-between! mx-auto p-0! gap-1! flex-row! transition-all duration-500 h-10 items-center`}
            >
                <div className="flex gap-1 items-center min-h-8 min-w-8 justify-center">
                    <small>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src={`${NotificationImages[notification.status]}`}
                        />
                    </small>
                </div>

                <div className="flex gap-1 items-center absolute left-1/2 top-1/2 -translate-1/2">
                    <div
                        className="w-1 h-1 rounded-full"
                        style={{
                            background: NotificationColors[notification.status],
                        }}
                    />
                    <span>{notification.status}</span>
                </div>

                <div className="flex gap-1 items-center">
                    <Tooltip
                        text="Delete this notification"
                        direction="top"
                    >
                        <Button>
                            <Image
                                width={16}
                                height={16}
                                alt="delete"
                                src="/delete.svg"
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <LinkButton
                className="box p-0! rounded-4xl!"
                href={`/notification/${notification.id}`}
            >
                <div className="flex flex-col gap-1">
                    <span>{notification.id}</span>
                    <span>{notification.title}</span>
                    <span>{notification.description}</span>
                    <span>{notification.status}</span>
                    <span>{relativeTime(notification.sentAt)}</span>
                </div>
            </LinkButton>
        </div>
    );
};
