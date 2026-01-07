import Image from "next/image";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Profile, User } from "@/types/tables/account";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../ProfileImage";
import { ProfileDisplay } from "../ProfileDisplay";
import { useEffect, useMemo } from "react";

type Props = {
    data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
    // zustand states
    const friends = useAppStore((state) => state.friends);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const promises = useAppStore((state) => state.promises);
    const friendRequests = useAppStore((state) => state.friendRequests);

    // zustand functions
    const modifyFriendship = useAppStore((state) => state.modifyFriendship);
    const getUsers = useAppStore((state) => state.getUsers);

    // messageboxes
    const unfriendMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to unfriend everyone!"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    modifyFriendship({
                        from_id: data.user.id,
                        type: "unfriend-all",
                        promiseKey: "unfriendAll"
                    });
                }
            }}
        />
    ));

    // fetching data
    useEffect(() => {
        getUsers({
            select: ["friends", "friend_requests"],
            id: [data.user.id],
        });
    }, [getUsers, data]);

    useEffect(() => {
        getUsers({
            select: ["profile"],
            id: [
                ...(friends[data.user.id] ?? []),
                ...(friendRequests?.[data.user.id]?.incoming ?? []),
                ...(friendRequests?.[data.user.id]?.outcoming ?? []),
            ],
        });
    }, [friends, friendRequests, data, getUsers]);

    // ui states
    const availableFriends = useMemo(() => {
        if (!friends[data.user.id]?.size) {
            return [];
        }

        return [...friends[data.user.id]];
    }, [friends, data]);

    const incomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.incoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].incoming];
    }, [friendRequests, data]);

    const outcomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.outcoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].outcoming];
    }, [friendRequests, data]);

    return (
        <div className="flex flex-col gap-4 p-8 w-full">
            {unfriendMessageBox.render()}
            <div className="flex flex-col gap-2 items-center">
                <span className="text-center text-foreground-2! text-5!">
                    <mark>{data.user.username}</mark>
                    &apos;s profile
                </span>
                <span>Your friends</span>
            </div>

            <hr />
            <div className="flex flex-col md:flex-row gap-4 grow w-full">
                <div className="flex flex-col items-center gap-2 w-full md:max-w-96">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />
                    <div className="flex items-center gap-1">
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/privacy.svg"
                        />
                        <span className="text-foreground-5!">
                            {data.user.role[0].toUpperCase() +
                                data.user.role.substring(1)}
                        </span>
                    </div>
                </div>
                <hr className="sm:w-px! sm:h-full" />

                <div className="flex flex-col gap-2 w-full">
                    <ul className="flex flex-col gap-2 w-full">
                        <li className="flex flex-col gap-1 min-h-16">
                            {/* friends topline */}
                            <span className="flex flex-wrap gap-2 items-center">
                                <b>Friend list</b>
                                <Tooltip
                                    text="Re-load friends"
                                    direction="top"
                                >
                                    <Button
                                        className="p-0!"
                                        onClick={() => {
                                            getUsers({
                                                select: ["friends", "friend_requests"],
                                                id: [data.user.id],
                                                promiseKey: "friendsReload",
                                                caching: false,
                                            });
                                        }}
                                    >
                                        {promises.friendsReload ===
                                        "pending" ? (
                                            <Spinner />
                                        ) : (
                                            <Image
                                                src="/reload.svg"
                                                width={16}
                                                height={16}
                                                alt="refresh"
                                            />
                                        )}
                                    </Button>
                                </Tooltip>
                                <small className="ml-auto">
                                    (all your friends are here)
                                </small>
                            </span>

                            {/* friends list */}
                            {promises.friends === "pending" ? (
                                <Spinner className="mx-auto" />
                            ) : !availableFriends.length ? (
                                <span>
                                    <small>No friends</small>
                                </span>
                            ) : (
                                <ul
                                    className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
                                    style={{ scrollbarWidth: "thin" }}
                                >
                                    {availableFriends.map((id) => (
                                        <li key={id}>
                                            {!profiles?.[id] ? (
                                                <Spinner />
                                            ) : (
                                                <ProfileDisplay
                                                    data={{
                                                        profile: profiles[id],
                                                        user: users[id],
                                                    }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <hr />
                        </li>

                        <li className="flex flex-col gap-1 min-h-16">
                            {/* incoming requests topline */}
                            <span className="flex flex-wrap gap-2 items-center">
                                <b>Incoming requests</b>
                                <small className="ml-auto">
                                    (your incoming requests)
                                </small>
                            </span>

                            {/* incoming requests */}
                            {promises.friend_requests === "pending" ? (
                                <Spinner className="mx-auto" />
                            ) : !incomingRequests.length ? (
                                <span>
                                    <small>No incoming requests</small>
                                </span>
                            ) : (
                                <ul
                                    className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
                                    style={{ scrollbarWidth: "thin" }}
                                >
                                    {incomingRequests.map((id) => (
                                        <li key={id}>
                                            {!profiles?.[id] ? (
                                                <Spinner />
                                            ) : (
                                                <ProfileDisplay
                                                    data={{
                                                        profile: profiles[id],
                                                        user: users[id],
                                                    }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <hr />
                        </li>

                        <li className="flex flex-col gap-1 min-h-16">
                            {/* outcoming requests topline */}
                            <span className="flex flex-wrap gap-2 items-center">
                                <b>Outcoming requests</b>
                                <small className="ml-auto">
                                    (your outcoming requests)
                                </small>
                            </span>

                            {/* outcoming requests */}
                            {promises.friend_requests === "pending" ? (
                                <Spinner className="mx-auto" />
                            ) : !outcomingRequests.length ? (
                                <span>
                                    <small>No outcoming requests</small>
                                </span>
                            ) : (
                                <ul
                                    className="flex flex-col gap-2 overflow-y-auto max-h-36 scheme-dark"
                                    style={{ scrollbarWidth: "thin" }}
                                >
                                    {outcomingRequests.map((id) => (
                                        <li key={id}>
                                            {!profiles?.[id] ? (
                                                <Spinner />
                                            ) : (
                                                <ProfileDisplay
                                                    data={{
                                                        profile: profiles[id],
                                                        user: users[id],
                                                    }}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <hr />
                        </li>
                    </ul>

                    <hr className="mt-auto" />
                    <Button
                        onClick={() => {
                            unfriendMessageBox.show();
                        }}
                    >
                        {promiseStatus(promises.unfriendAll)}
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/cross.svg"
                        />
                        Unfriend everyone
                    </Button>
                </div>
            </div>
        </div>
    );
};
