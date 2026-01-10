import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ProfileDisplay } from "../../ProfileDisplay";
import Image from "next/image";
import { useMemo } from "react";
import { useAppStore } from "@/zustand/store";
import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { profile: Profile; user: User };
};

export const FriendList = ({ data }: Props) => {
    // zustand
    const friends = useAppStore((state) => state.friends);
    const promises = useAppStore((state) => state.promises);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const getUsers = useAppStore((state) => state.getUsers);

    // ui states
    const availableFriends = useMemo(() => {
        if (!friends[data.user.id]?.size) {
            return [];
        }

        return [...friends[data.user.id]];
    }, [friends, data]);

    return (
        <li className="flex flex-col gap-1 min-h-24">
            {/* friends topline */}
            <span className="flex  gap-2 items-center whitespace-nowrap">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/friends.svg"
                />

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
                        {promises.friendsReload === "pending" ? (
                            <Spinner />
                        ) : (
                            <Image
                                src="/reload.svg"
                                width={12}
                                height={12}
                                alt="refresh"
                            />
                        )}
                    </Button>
                </Tooltip>
                <small className="ml-auto text-ellipsis-left">
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
                    className="flex flex-col gap-2 overflow-y-auto max-h-128 scheme-dark"
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
            <hr/>
        </li>
    );
};
