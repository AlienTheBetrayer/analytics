/** @format */

import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { useAppStore } from "@/zustand/store";

type Props = {
    type: MessageInputProps["type"];
    actionMessage: MessageInputProps["actionMessage"];
};

export const Replying = ({ type, actionMessage }: Props) => {
    // zustand
    const messages = useAppStore((state) => state.messages);

    // jsx
    return (
        <div
            style={{
                height: type === "reply" ? "2.5rem" : "0rem",
                opacity: type === "reply" ? "1" : "0",
            }}
            inert={type !== "reply"}
            className="box flex-row! gap-1! items-center p-0! bg-bg-1! border-0! duration-300! overflow-hidden"
        >
            <ProfileImage
                profile={messages?.users.get(actionMessage?.user_id ?? "")?.profile}
                width={256}
                height={256}
                className="w-6! h-6! ml-10"
            />

            <span className="flex items-center gap-1">
                <small>Reply to</small>
                <span>{actionMessage?.message}</span>
            </span>
        </div>
    );
};
