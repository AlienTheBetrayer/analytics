import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import Image from "next/image";

type Props = {
    type: MessageInputProps["type"];
    actionMessage: MessageInputProps["actionMessage"];
};

export const Editing = ({ type, actionMessage }: Props) => {
    return (
        <div
            style={{
                height: type === "edit" ? "2.5rem" : "0rem",
                opacity: type === "edit" ? "1" : "0",
            }}
            inert={type !== "edit"}
            className="box flex-row! gap-1! items-center p-0! bg-bg-1! border-0! duration-300! overflow-hidden"
        >
            <div className="box p-0.75! rounded-lg! ml-10 bg-bg-2!">
                <Image
                    alt=""
                    width={13}
                    height={13}
                    src="/pencil.svg"
                />
            </div>

            <span className="flex items-center gap-1">
                <small>Editing...</small>
                <span>{actionMessage?.message}</span>
            </span>
        </div>
    );
};
