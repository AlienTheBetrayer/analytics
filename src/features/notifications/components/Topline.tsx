import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NotificationRoute } from "../types/notifications";
import { TabSelection } from "@/utils/other/TabSelection";
import { useAppStore } from "@/zustand/store";

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
        <ul
            className={`box w-full max-w-400 mx-auto! p-0! my-2! gap-1! flex-row! transition-all duration-500 h-10 items-center`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt="Notifications"
                        src="/notification.svg"
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Go back home">
                    <LinkButton href="/home/">
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/cube.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3! bg-background-6" />
            </li>

            <li>
                <Tooltip text="Push synthetic notifications">
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
            </li>

            <li>
                <Tooltip text="Notifications preferences">
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
            </li>

            {((lastNotificationId && !id) || type === "specific") && (
                <li className="self-stretch flex items-center">
                    <hr className="w-px! h-1/3! bg-background-6" />
                </li>
            )}

            {type === "specific" && (
                <li>
                    <Tooltip text="Go back to the notification centre">
                        <LinkButton href="/notifications/">
                            <Image
                                width={16}
                                height={16}
                                alt="home"
                                src="/back.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            )}

            {lastNotificationId && !id && (
                <li>
                    <Tooltip
                        text="View the most recent notification"
                        direction="top"
                    >
                        <LinkButton
                            href={`/notification/${lastNotificationId}`}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="latest"
                                src="/calendar.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            )}

            <li className="ml-auto!">
                <Tooltip text="All notifications">
                    <LinkButton href={`/notifications/all`}>
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
            </li>

            <li>
                <Tooltip text="Dashboard-only notifications">
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
                            condition={unreadTabs.Dashboard}
                            color="var(--orange-1)"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li>
                <Tooltip text="Account-only notifications">
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
                            condition={unreadTabs.Account}
                            color="var(--orange-1)"
                        />
                    </LinkButton>
                </Tooltip>
            </li>
        </ul>
    );
};
