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

export const Outcoming = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const friendRequests = useAppStore((state) => state.friendRequests);
    const getUsers = useAppStore((state) => state.getUsers);

    // ui
    const outcomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.outcoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].outcoming];
    }, [friendRequests, data]);

    return (
        <div className="flex flex-col gap-2 grow">
            {/* outcoming requests topline */}
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

                <hr className='w-px! h-1/3 bg-background-a-10'/>

                <b>Outcoming requests</b>

                <small className="ml-auto text-ellipsis-left">
                    (you sent these)
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
                    className="flex flex-col gap-2 overflow-y-auto max-h-128 scheme-dark"
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

            <hr className="mt-auto" />
        </div>
    );
};
