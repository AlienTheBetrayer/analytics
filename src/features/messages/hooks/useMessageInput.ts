import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
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
    onCancel,
    type,
    actionMessage,
    onDelete,
}: MessageInputProps & { onDelete: () => void }) => {
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
        if (type !== "edit" && type !== "reply") {
            return;
        }

        inputRef.current?.focus();
    }, [type]);

    useEffect(() => {
        if (type !== "edit") {
            return;
        }

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

        // clearing
        if (currentId) {
            setMessages(currentId, "");
        }
        setEdit("");
        setTemp("");

        switch (type) {
            case "edit": {
                if (!cid || !actionMessage) {
                    return;
                }

                if (edit === "") {
                    onDelete();
                } else {
                    upsertMessage({
                        type: "edit",
                        message: actionMessage,
                        content: edit,
                        user: status,
                    });
                    onCancel();
                }
                break;
            }
            case "send": {
                onCancel();

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

                break;
            }
            case "reply": {
                onCancel();

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
                break;
            }
        }
    }, [
        setMessages,
        onCancel,
        onDelete,
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
