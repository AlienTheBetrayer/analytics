import { Spinner } from "@/features/spinner/components/Spinner";
import { ProfileDisplay } from "../../ProfileDisplay";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { profile: Profile; user: User };
};

export const IncomingList = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const friendRequests = useAppStore((state) => state.friendRequests);

    // ui
    const incomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.incoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].incoming];
    }, [friendRequests, data]);

    return (
        <li className="flex flex-col gap-1 min-h-24">
            {/* incoming requests topline */}
            <span className="flex gap-2 items-center whitespace-nowrap">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/plus.svg"
                />

                <b>Incoming requests</b>

                <small className="ml-auto text-ellipsis-left">
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
            <hr className="mt-auto!" />
        </li>
    );
};
