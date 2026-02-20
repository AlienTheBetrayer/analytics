import { MessageInputProps } from "@/features/messages/components/message/MessageInput";
import { upsertMessage } from "@/query-api/calls/messages";
import { useQuery } from "@/query/core";
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

    // states + derived
    const [message, setMessage] = useState<string>(""); // recordify
    const [edit, setEdit] = useState<string>("");
    const isSendable = !!message.trim().length;
    const lastConversation = useRef<string | null>(null);

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

    // clearing input on chat switch
    useEffect(() => {
        if (!data) {
            return;
        }

        if (lastConversation.current !== data.id) {
            requestAnimationFrame(() => {
                setMessage("");
                setEdit("");
            });
        }

        lastConversation.current = data.id;
    }, [data]);

    // User functions
    const send = useCallback(() => {
        if (!message.trim() || !status) {
            return;
        }

        const cid = data?.id ?? retrieved?.conversation_id;

        if (cid) {
            upsertMessage({
                type: "send",
                user: status,
                conversation_id: cid,
                message,
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
                message,
            }).then((message) => {
                if (tab === "notes") {
                    return;
                }

                redirect(`/messages/c/${message.conversation_id}`);
            });
        }

        setMessage("");
    }, [message, status, retrieved, data, setMessage, tab]);

    return useMemo(() => {
        return { setMessage, send, inputRef, message, edit, isSendable };
    }, [send, setMessage, message, edit, isSendable]);
};
