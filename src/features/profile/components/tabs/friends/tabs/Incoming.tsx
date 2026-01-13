import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";
import { ProfileDisplay } from "../../../ProfileDisplay";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";

type Props = {
    data: { profile: Profile; user: User };
};

export const Incoming = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const friendRequests = useAppStore((state) => state.friendRequests);
    const getUsers = useAppStore((state) => state.getUsers);

    // ui
    const incomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.incoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].incoming];
    }, [friendRequests, data]);

    return (
        <div className="flex flex-col gap-2 grow">
            {/* incoming requests topline */}
            <span className="flex gap-2 items-center whitespace-nowrap">
                <Tooltip
                    text="Re-load friend requests"
                    direction="top"
                >
                    <Button
                        className="p-0!"
                        onClick={() => {
                            getUsers({
                                select: ["friend_requests"],
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
                                width={14}
                                height={14}
                                alt="refresh"
                            />
                        )}
                    </Button>
                </Tooltip>

                <hr className='w-px! h-1/2 bg-background-a-10'/>

                <b>Incoming requests</b>

                <small className="ml-auto text-ellipsis-left">
                    (you received these)
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
                    className="flex flex-col gap-2 overflow-y-auto max-h-128 scheme-dark"
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

            <hr className="mt-auto" />
        </div>
    );
};
