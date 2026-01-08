import { Spinner } from "@/features/spinner/components/Spinner";
import { ProfileDisplay } from "../../ProfileDisplay";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { profile: Profile; user: User };
};

export const OutcomingList = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const friendRequests = useAppStore((state) => state.friendRequests);

    // ui
    const outcomingRequests = useMemo(() => {
        if (!friendRequests[data.user.id]?.outcoming?.size) {
            return [];
        }

        return [...friendRequests[data.user.id].outcoming];
    }, [friendRequests, data]);

    return (
        <li className="flex flex-col gap-1 min-h-24">
            {/* outcoming requests topline */}
            <span className="flex gap-2 items-center whitespace-nowrap">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/send.svg"
                />

                <b>Outcoming requests</b>

                <small className="ml-auto text-ellipsis-left">
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
        </li>
    );
};
