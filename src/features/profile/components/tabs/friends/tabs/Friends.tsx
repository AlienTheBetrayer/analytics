import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ProfileDisplay } from "../../../ProfileDisplay";
import Image from "next/image";
import { useMemo } from "react";
import { useAppStore } from "@/zustand/store";
import { Profile, User } from "@/types/tables/account";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { promiseStatus } from "@/utils/other/status";

type Props = {
    data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
    // zustand
    const friends = useAppStore((state) => state.friends);
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);
    const promises = useAppStore((state) => state.promises);
    const getUsers = useAppStore((state) => state.getUsers);
    const modifyFriendship = useAppStore((state) => state.modifyFriendship);

    // ui states
    const availableFriends = useMemo(() => {
        if (!friends[data.user.id]?.size) {
            return [];
        }

        return [...friends[data.user.id]];
    }, [friends, data]);

    const unfriendMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to unfriend everyone!"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    modifyFriendship({
                        from_id: data.user.id,
                        type: "unfriend-all",
                        promiseKey: "unfriendAll",
                    });
                }
            }}
        />
    ));

    return (
        <div className="flex flex-col gap-2 grow">
            {/* friends topline */}
            <span className="flex  gap-2 items-center whitespace-nowrap">
                <Tooltip
                    text="Re-load friends"
                    direction="top"
                >
                    <Button
                        className="p-0!"
                        onClick={() => {
                            getUsers({
                                select: ["friends"],
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

                <hr className="w-px! h-1/3 bg-background-a-10" />

                <span>Your friends</span>

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
                    {[...availableFriends].map((id) => (
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
                    src="/delete.svg"
                />
                Unfriend everyone
            </Button>
        </div>
    );
};
