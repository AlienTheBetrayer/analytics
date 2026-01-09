import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { useParams } from "next/navigation";

export const Topline = () => {
    const { tab } = useParams<{ tab?: string }>();

    console.log(tab);
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
                        src="/home.svg"
                    />
                    <span className="hidden md:block">Home</span>
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Go to the dashboard"
                direction="top"
            >
                <LinkButton
                    href="/dashboard/"
                    className={`p-0! md:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="dashboard"
                        src="/dashboard.svg"
                    />
                    <span className="hidden md:block">Dashboard</span>
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Go to your profile"
                direction="top"
            >
                <LinkButton
                    href="/profile/"
                    className={`p-0! md:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="profile"
                        src="/account.svg"
                    />
                    <span className="hidden md:block">Profile</span>
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Dashboard-only notifications"
                direction="top"
                className="ml-auto"
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
                    {(!tab || tab === "dashboard") && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
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
                </LinkButton>
            </Tooltip>
        </div>
    );
};
