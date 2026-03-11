/** @format */

import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

export const useInputStatus = (type: MessageInputProps["type"]) => {
    // zustand
    const conversation = useAppStore((state) => state.conversation);

    // determining the styles
    const determined = useMemo(() => {
        if (conversation?.membership.can_send === false) {
            return {
                color: "var(--red-1)",
                src: "/cross.svg",
            };
        }

        switch (type) {
            case "edit": {
                return {
                    color: "var(--orange-1)",
                    src: "/pencil.svg",
                };
            }
            case "reply": {
                return {
                    color: "var(--blue-3)",
                    src: "/back.svg",
                };
            }
            default: {
                return {
                    color: "var(--blue-1)",
                    src: "/send.svg",
                };
            }
        }
    }, [type, conversation?.membership.can_send]);

    // returning
    return useMemo(() => {
        return { determined };
    }, [determined]);
};
