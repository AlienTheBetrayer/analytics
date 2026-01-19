import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { NotificationColors } from "../parts/NotificationCompact";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { NotificationPartial } from "@/types/other/notifications";

type Props = {
    notification: NotificationPartial;
    onInteract?: () => void;
};

export const Topline = ({ notification, onInteract }: Props) => {
    return (
        <ul className="box p-0! relative flex flex-row! items-center justify-between border-b border-b-background-a-11">
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div
                    className="w-1 h-1 rounded-full"
                    style={{
                        background: NotificationColors[notification.status],
                    }}
                />

                <span>{notification.status}</span>
            </li>

            <li>
                <Tooltip text="Notification centre">
                    <LinkButton href="/notifications">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/notification.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="ml-auto!">
                <Tooltip text="Hide">
                    <Button onClick={onInteract}>
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
    );
};
