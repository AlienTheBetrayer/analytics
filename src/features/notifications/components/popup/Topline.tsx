import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { NotificationColors } from "../parts/NotificationCompact";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { NotificationData } from "@/types/other/notifications";

type Props = {
    notification: NotificationData;
    onInteract?: () => void;
};

export const Topline = ({ notification, onInteract }: Props) => {
    return (
        <ul className="flex relative items-center justify-between h-10">
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div
                    className="w-1 h-1 rounded-full"
                    style={{
                        background: NotificationColors[notification.status],
                    }}
                />

                <span>{notification.status}</span>
            </li>

            <li className="absolute right-2 top-1/2 -translate-y-1/2">
                <ul className="flex items-center gap-2">
                    <li>
                        <Tooltip text="Notification centre">
                            <LinkButton
                                href="/notifications"
                                className="min-w-6! min-h-6! w-6! h-6! p-0! rounded-lg!"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/launch.svg"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Hide">
                            <Button
                                onClick={onInteract}
                                className="min-w-6! min-h-6! w-6! h-6! p-0! rounded-lg!"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/cross.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
