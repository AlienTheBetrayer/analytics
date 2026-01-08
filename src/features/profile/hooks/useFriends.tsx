import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Profile, User } from "@/types/tables/account";
import { useAppStore } from "@/zustand/store";
import { useEffect } from "react";

export const useFriends = (data: { profile: Profile; user: User }) => {
    // zustand states
    const modifyFriendship = useAppStore((state) => state.modifyFriendship);
    const getUsers = useAppStore((state) => state.getUsers);
    const friends = useAppStore((state) => state.friends);
    const friendRequests = useAppStore((state) => state.friendRequests);

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
                        promiseKey: "unfriendAll",
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

    return { unfriendMessageBox };
};
