import { MessageInputProps } from "@/features/messages/components/message/MessageInput";
import { upsertMessage } from "@/query-api/calls/messages";
import { useQuery } from "@/query/core";
import { useLocalStore } from "@/zustand/localStore";
import { redirect, useParams } from "next/navigation";
import {
    useState,
    useRef,
    useImperativeHandle,
    useEffect,
    useCallback,
    useMemo,
} from "react";

export const useMessageInput = ({
    retrieved,
    data,
    ref,
    type,
    editingMessage,
}: MessageInputProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { tab } = useParams<{ tab?: string }>();

    // states
    const messages = useLocalStore((state) => state.messageInputs);
    const setMessages = useLocalStore((state) => state.updateMessageInput);
    const [edit, setEdit] = useState<string>("");

    // derived states
    const currentId = (data?.id || retrieved?.conversation_id) ?? null;
    const currentMessage =
        (data?.id
            ? messages[data.id]
            : retrieved?.conversation_id
              ? messages[retrieved.conversation_id]
              : "") ?? "";
    const isSendable = !!currentMessage.trim().length;

    // refs
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);

    // focusing
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (type !== "edit") {
            return;
        }

        inputRef.current?.focus();
        requestAnimationFrame(() => {
            if (!editingMessage) {
                return;
            }

            setEdit(editingMessage.message);
        });
    }, [type, editingMessage]);

    // User functions
    const send = useCallback(() => {
        if (!status) {
            return;
        }

        const cid = data?.id ?? retrieved?.conversation_id;

        if (cid) {
            if (!currentMessage) {
                return;
            }

            upsertMessage({
                type: "send",
                user: status,
                conversation_id: cid,
                message: currentMessage,
            });
        } else {
            const to_id = tab === "notes" ? "notes" : retrieved?.user?.id;

            if (!to_id) {
                return;
            }

            upsertMessage({
                type: "start_dm",
                user: status,
                to_id,
                message: currentMessage,
            }).then((message) => {
                if (tab === "notes") {
                    return;
                }

                redirect(`/messages/c/${message.conversation_id}`);
            });
        }

        if (currentId) {
            setMessages(currentId, "");
            setEdit("");
        }
    }, [status, retrieved, data, setMessages, tab, currentMessage, currentId]);

    const setMessage = useCallback(
        (value: string) => {
            if (!currentId) {
                return;
            }

            switch (type) {
                case "edit": {
                    setEdit(value);
                    break;
                }
                case "send": {
                    setMessages(currentId, value);
                    break;
                }
            }
        },
        [setMessages, currentId, type],
    );

    return useMemo(() => {
        return {
            setMessage,
            send,
            inputRef,
            message: currentMessage,
            edit,
            isSendable,
        };
    }, [send, setMessage, currentMessage, edit, isSendable]);
};
