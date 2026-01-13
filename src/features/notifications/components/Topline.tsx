import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NotificationRoute } from "../types/notifications";
import { useLocalStore } from "@/zustand/localStore";
import { TabSelection } from "@/utils/other/TabSelection";

type Props = {
    type: NotificationRoute;
};

export const Topline = ({ type }: Props) => {
    // zustand
    const unreadTabs = useLocalStore((state) => state.unreadTabs);
    const lastNotificationId = useLocalStore(
        (state) => state.lastNotificationId
    );

    // url
    const { id, tab } = useParams<{ id?: string; tab?: string }>();

    return (
        <div
            className={`box w-full max-w-400 mx-auto p-0! my-2 gap-1! flex-row! transition-all duration-500 h-10 items-center`}
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
                            src="/back.svg"
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
                        src="/cubes.svg"
                    />
                    <span className="hidden sm:block">All</span>
                    <TabSelection
                        condition={tab === "all" || (!tab && !id)}
                        color="var(--blue-1)"
                    />
                </LinkButton>
            </Tooltip>

            <hr className="w-px! h-1/2 bg-background-a-8" />
            <Tooltip
                text="Dashboard-only notifications"
                direction="top"
            >
                <LinkButton href={`/notifications/dashboard`}>
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/dashboard.svg"
                    />
                    <span className="hidden sm:block">Dashboard</span>

                    <TabSelection
                        condition={tab === "dashboard"}
                        color="var(--blue-1)"
                    />
                    <TabSelection
                        condition={unreadTabs.dashboard}
                        color="var(--orange-1)"
                    />
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Account-only notifications"
                direction="top"
            >
                <LinkButton href={`/notifications/account`}>
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/account.svg"
                    />
                    <span className="hidden sm:block">Account</span>

                    <TabSelection
                        condition={tab === "account"}
                        color="var(--blue-1)"
                    />
                    <TabSelection
                        condition={unreadTabs.account}
                        color="var(--orange-1)"
                    />
                </LinkButton>
            </Tooltip>

            <hr className="w-px! h-1/2 bg-background-a-8" />
            <Tooltip
                text="Push synthetic notifications"
                direction="top"
            >
                <LinkButton href={`/notifications/emulate`}>
                    <Image
                        width={16}
                        height={16}
                        alt="emulate"
                        src="/emulate.svg"
                    />

                    <TabSelection
                        condition={tab === "emulate"}
                        color="var(--blue-1)"
                    />
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Notifications preferences"
                direction="top"
            >
                <LinkButton href="/notifications/preferences">
                    <Image
                        width={16}
                        height={16}
                        alt="preferences"
                        src="/settings.svg"
                    />
                    
                    <TabSelection
                        condition={tab === "preferences"}
                        color="var(--blue-1)"
                    />
                </LinkButton>
            </Tooltip>
        </div>
    );
};
