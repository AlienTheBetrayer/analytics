import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

type Props = {
    type: MessageInputProps["type"];
    onCancel: MessageInputProps["onCancel"];
    actionMessage: MessageInputProps["actionMessage"];
};

export const Replying = ({ type, onCancel, actionMessage }: Props) => {
    return (
        <div
            style={{
                height: type === "reply" ? "2.5rem" : "0rem",
                opacity: type === "reply" ? "1" : "0",
            }}
            inert={type !== "reply"}
            className="box flex-row! items-center p-0! bg-bg-2! duration-300! overflow-hidden"
        >
            <Button
                onClick={() => {
                    onCancel?.();
                }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/back.svg"
                />
            </Button>

            <div className="w-1 h-1 rounded-full bg-blue-1" />

            <ProfileImage
                profile={actionMessage?.user.profile}
                width={256}
                height={256}
                className="w-6! h-6!"
            />

            <span className="flex items-center gap-1">
                <small>Reply to</small>
                <span>{actionMessage?.message}</span>
            </span>
        </div>
    );
};
