import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NotificationRoute } from "../types/notifications";

type Props = {
    type: NotificationRoute;
};

export const Topline = ({ type }: Props) => {
    // zustand
    const unreadTabs = useAppStore((state) => state.unreadTabs);
    const lastNotificationId = useAppStore((state) => state.lastNotificationId);

    // url
    const { id, tab } = useParams<{ id?: string; tab?: string }>();

    return (
        <div
            className={`box w-full max-w-7xl mx-auto p-0! my-2 gap-1! flex-row! transition-all duration-500 h-10 items-center`}
        >
            <span className="flex gap-1 items-center absolute left-1/2 -translate-1/2 top-1/2">
                <div className="rounded-full w-1 h-1 bg-blue-1" />
                Notifications
            </span>

            <Tooltip
                text="Go back home"
                direction="top"
            >
                <LinkButton
                    href="/home/"
                    className={`p-0! md:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/cube.svg"
                    />
                    <span className="hidden md:block">Home</span>
                </LinkButton>
            </Tooltip>

            {type === "specific" && (
                <Tooltip
                    text="Go back to the notification centre"
                    direction="top"
                >
                    <LinkButton
                        href="/notifications/"
                        className={`p-0! md:px-2!`}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/send.svg"
                        />
                        <span className="hidden md:block">Notifications</span>
                    </LinkButton>
                </Tooltip>
            )}

            {lastNotificationId && !id && (
                <Tooltip
                    text="View the most recent notification"
                    direction="top"
                >
                    <LinkButton
                        href={`/notification/${lastNotificationId}`}
                        className={`p-0! md:px-2!`}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="latest"
                            src="/calendar.svg"
                        />
                        <span className="hidden md:block">Latest</span>
                    </LinkButton>
                </Tooltip>
            )}

            <Tooltip
                text="All notifications"
                direction="top"
                className="ml-auto"
            >
                <LinkButton
                    href={`/notifications/all`}
                    className={`p-0! sm:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="all"
                        src="/server.svg"
                    />
                    <span className="hidden sm:block">All</span>
                    {(tab === "all" || (!tab && !id)) && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Dashboard-only notifications"
                direction="top"
            >
                <LinkButton
                    href={`/notifications/dashboard`}
                    className={`p-0! sm:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/book.svg"
                    />
                    <span className="hidden sm:block">Dashboard</span>
                    {tab === "dashboard" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                    {unreadTabs.has("dashboard") && (
                        <div className="absolute right-1 top-1 z-1 rounded-full w-1 h-1 transition-all duration-500 tab-unread" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Account-only notifications"
                direction="top"
            >
                <LinkButton
                    href={`/notifications/account`}
                    className={`p-0! sm:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/launch.svg"
                    />
                    <span className="hidden sm:block">Account</span>
                    {tab === "account" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                    {unreadTabs.has("account") && (
                        <div className="absolute right-1 top-1 z-1 rounded-full w-1 h-1 transition-all duration-500 tab-unread" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Push synthetic notifications"
                direction="top"
            >
                <LinkButton
                    href={`/notifications/emulate`}
                    className={`p-0! sm:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="emulate"
                        src="/emulate.svg"
                    />
                    <span className="hidden sm:block">Emulate</span>
                    {tab === "emulate" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Notifications preferences"
                direction="top"
            >
                <LinkButton
                    href="/notifications/preferences"
                    className={`p-0! md:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="preferences"
                        src="/settings.svg"
                    />
                    <span className="hidden md:block">Preferences</span>
                    {tab === "preferences" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>
        </div>
    );
};
