import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { deleteMessage, upsertMessage } from "@/query-api/calls/messages";
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
    onCancel,
    type,
    actionMessage,
}: MessageInputProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { tab } = useParams<{ tab?: string }>();

    // states
    const messages = useLocalStore((state) => state.messageInputs);
    const setMessages = useLocalStore((state) => state.updateMessageInput);
    const [edit, setEdit] = useState<string>("");
    const [temp, setTemp] = useState<string>("");

    // derived states
    const currentId =
        (data?.[0]?.conversation_id || retrieved?.conversation_id) ?? null;
    const currentMessage =
        (temp
            ? temp
            : data?.[0]?.conversation_id
              ? messages[data[0].conversation_id]
              : retrieved?.conversation_id
                ? messages[retrieved.conversation_id]
                : "") ?? "";
    const isSendable = !!(temp
        ? temp.trim().length
        : type === "edit"
          ? edit.trim().length
          : currentMessage.trim().length);

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
            if (!actionMessage) {
                return;
            }

            setEdit(actionMessage.message);
        });
    }, [type, actionMessage]);

    // User functions
    const updateMessage = useCallback(() => {
        if (!status) {
            return;
        }

        const cid = data?.[0]?.conversation_id ?? retrieved?.conversation_id;

        switch (type) {
            case "edit": {
                onCancel();
                setEdit("");

                if (!cid || !actionMessage) {
                    return;
                }

                if (edit === "") {
                    deleteMessage({ message: actionMessage });
                } else {
                    upsertMessage({
                        type: "edit",
                        message: actionMessage,
                        content: edit,
                        user: status,
                    });
                }
                break;
            }
            case "send": {
                if (cid) {
                    if (!currentMessage) {
                        return;
                    }

                    upsertMessage({
                        type: "send",
                        conversation_id: cid,
                        message: currentMessage,
                        reply: actionMessage,
                        user: status,
                    });
                } else {
                    setTemp("");
                    const to_id =
                        tab === "notes" ? "notes" : retrieved?.user?.id;

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
                }
                break;
            }
            case "reply": {
                if (!currentId || !cid || !currentMessage) {
                    break;
                }

                upsertMessage({
                    type: "send",
                    conversation_id: cid,
                    message: currentMessage,
                    reply: actionMessage,
                    user: status,
                });
                setMessages(currentId, "");
                break;
            }
        }
    }, [
        setMessages,
        onCancel,
        status,
        tab,
        edit,
        currentMessage,
        currentId,
        retrieved,
        data,
        type,
        actionMessage,
    ]);

    const setMessage = useCallback(
        (value: string) => {
            switch (type) {
                case "edit": {
                    setEdit(value);
                    break;
                }
                default: {
                    if (currentId) {
                        setMessages(currentId, value);
                    } else {
                        setTemp(value);
                    }
                    break;
                }
            }
        },
        [setMessages, currentId, type],
    );

    return useMemo(() => {
        return {
            setMessage,
            updateMessage,
            inputRef,
            message: currentMessage,
            edit,
            isSendable,
        };
    }, [updateMessage, setMessage, currentMessage, edit, isSendable]);
};
