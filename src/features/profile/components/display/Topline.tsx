import "./Topline.css";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { RoleEditing } from "../modals/RoleEditing";
import { useParams } from "next/navigation";

type Props = {
    data: { user: User; profile: Profile };
};

export const Topline = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);

    const { tab } = useParams<{ tab: string }>();

    return (
        <div
            className={`box p-0! gap-2! flex-row! max-w-7xl w-full m-auto transition-all duration-500 h-10 items-center`}
        >
            <Tooltip
                text="Go back home"
                direction="top"
            >
                <LinkButton
                    href="/home/"
                    className={`p-0!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/home.svg"
                    />
                </LinkButton>
            </Tooltip>

            {status && status.role === "op" && (
                <Tooltip
                    type="modal"
                    direction="right"
                    disabledPointer={false}
                    element={<RoleEditing data={data} />}
                >
                    <Button className="p-0!">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cube.svg"
                        />
                    </Button>
                </Tooltip>
            )}

            {status && status.id !== data.user.id && (
                <Tooltip text="Go back to friends tab">
                    <LinkButton
                        href={`/profile/${status.username}/friends`}
                        className="p-0!"
                    >
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/back.svg"
                        />
                    </LinkButton>
                </Tooltip>
            )}

            <Tooltip
                text="Profile overview"
                direction="top"
                className="ml-auto"
            >
                <LinkButton
                    href={`/profile/${data.user.username}/overview`}
                    className={`p-0! sm:px-2!`}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/launch.svg"
                    />
                    <span className="hidden sm:block">Overview</span>
                    {tab === "overview" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Edit the profile"
                direction="top"
            >
                <LinkButton
                    href={`/profile/${data.user.username}/edit`}
                    className={`p-0! sm:px-2! `}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/pencil.svg"
                    />
                    <span className="hidden sm:block">Edit</span>
                    {tab === "edit" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Security measures"
                direction="top"
            >
                <LinkButton
                    href={`/profile/${data.user.username}/security`}
                    className={`p-0! sm:px-2! `}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/security.svg"
                    />
                    <span className="hidden sm:block">Security</span>
                    {tab === "security" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>

            <Tooltip
                text="Friends and Friend requests"
                direction="top"
            >
                <LinkButton
                    href={`/profile/${data.user.username}/friends`}
                    className={`p-0! sm:px-2! `}
                >
                    <Image
                        width={16}
                        height={16}
                        alt="home"
                        src="/friends.svg"
                    />
                    <span className="hidden sm:block">Friends</span>
                    {tab === "friends" && (
                        <div className="absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 tab-selection" />
                    )}
                </LinkButton>
            </Tooltip>
        </div>
    );
};
