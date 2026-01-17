import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { RoleEditing } from "../modals/RoleEditing";
import { useParams } from "next/navigation";
import { TabSelection } from "@/utils/other/TabSelection";

type Props = {
    data: { user: User; profile: Profile };
};

export const Topline = ({ data }: Props) => {
    // zustand
    const status = useAppStore((state) => state.status);
    const friendRequests = useAppStore((state) => state.friendRequests);

    // url
    const { tab } = useParams<{ tab?: string }>();

    return (
        <ul
            className={`box p-0! gap-1! my-2! mx-auto! flex-row! max-w-400 w-full transition-all duration-500 h-10 items-center`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt="Profile"
                        src="/account.svg"
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Back home">
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

            {status && status.role === "op" && (
                <li>
                    <Tooltip text="Administrator panel">
                        <Tooltip
                            type="modal"
                            direction="right"
                            disabledPointer={false}
                            element={<RoleEditing data={data} />}
                        >
                            <Button>
                                <div className="w-1 h-1 rounded-full bg-red-1" />
                                <Image
                                    width={16}
                                    height={16}
                                    alt="admin"
                                    src="/settings.svg"
                                />
                            </Button>
                        </Tooltip>
                    </Tooltip>
                </li>
            )}

            {status && status.id !== data.user.id && (
                <li>
                    <Tooltip text="Go back to friends tab">
                        <LinkButton
                            href={`/profile/${status.username}/friends`}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/back.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            )}

            <li className="ml-auto!">
                <Tooltip text="User's posts">
                    <LinkButton href={`/posts/${data.user.username}`}>
                        <Image
                            width={14}
                            height={14}
                            alt=""
                            src="/select.svg"
                        />
                        <span className="hidden sm:block">Posts</span>
                        <TabSelection
                            condition={tab === "posts"}
                            color="var(--blue-1)"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li>
                <Tooltip text="Profile overview">
                    <LinkButton
                        href={`/profile/${data.user.username}/overview`}
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/launch.svg"
                        />
                        <span className="hidden sm:block">Overview</span>
                        <TabSelection
                            condition={!tab || tab === "overview"}
                            color="var(--blue-1)"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            {((status && status.id === data.user.id) ||
                status?.role === "op") && (
                <>
                    <li>
                        <Tooltip text="Edit the profile">
                            <LinkButton
                                href={`/profile/${data.user.username}/edit`}
                            >
                                <Image
                                    width={16}
                                    height={16}
                                    alt="home"
                                    src="/pencil.svg"
                                />
                                <span className="hidden sm:block">Edit</span>
                                <TabSelection
                                    condition={tab === "edit"}
                                    color="var(--blue-1)"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Security measures">
                            <LinkButton
                                href={`/profile/${data.user.username}/security`}
                            >
                                <Image
                                    width={16}
                                    height={16}
                                    alt="home"
                                    src="/security.svg"
                                />
                                <span className="hidden sm:block">
                                    Security
                                </span>
                                <TabSelection
                                    condition={tab === "security"}
                                    color="var(--blue-1)"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Friends and Friend requests">
                            <LinkButton
                                href={`/profile/${data.user.username}/friends`}
                            >
                                <Image
                                    width={16}
                                    height={16}
                                    alt="home"
                                    src="/friends.svg"
                                />
                                <span className="hidden sm:block">Friends</span>
                                <TabSelection
                                    condition={tab === "friends"}
                                    color="var(--blue-1)"
                                />
                                <TabSelection
                                    condition={
                                        !!friendRequests[data.user.id]?.incoming
                                            ?.size
                                    }
                                    color="var(--orange-1)"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>
                </>
            )}
        </ul>
    );
};
