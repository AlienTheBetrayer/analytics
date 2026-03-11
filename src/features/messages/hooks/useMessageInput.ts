/** @format */

import { MessageInputProps } from "@/features/messages/components/message/input/MessageInput";
import { upsertMessage } from "@/query-api/calls/messages";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import { redirect, useParams } from "next/navigation";
import { useState, useRef, useImperativeHandle, useEffect, useCallback, useMemo } from "react";

export const useMessageInput = ({
    ref,
    onCancel,
    type,
    actionMessage,
    onDelete,
}: MessageInputProps & { onDelete: () => void }) => {
    // url
    const { tab } = useParams<{ tab?: string }>();

    // zustand
    const conversation = useAppStore((state) => state.conversation);
    const retrieved = useAppStore((state) => state.retrieved);
    const drafts = useLocalStore((state) => state.drafts);
    const updateDrafts = useLocalStore((state) => state.updateDrafts);

    // states
    const [edit, setEdit] = useState<string>("");
    const [temp, setTemp] = useState<string>("");

    // derived states
    const currentId = (conversation || retrieved?.conversation_id) ?? null;
    const currentMessage =
        (temp ? temp
        : conversation ? drafts[conversation.id]
        : retrieved?.conversation_id ? drafts[retrieved.conversation_id]
        : "") ?? "";
    const isSendable = !!(temp ? temp.trim().length
    : type === "edit" ? edit.trim().length
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
        const cid = conversation?.id ?? retrieved?.conversation_id;

        // clearing
        if (retrieved?.conversation_id) {
            updateDrafts(retrieved.conversation_id, "");
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
                    });
                } else {
                    const to_id = tab === "notes" ? "notes" : retrieved?.user?.id;

                    if (!to_id) {
                        return;
                    }

                    upsertMessage({
                        type: "start_dm",
                        to_id,
                        message: currentMessage,
                    }).then((message) => {
                        if (tab === "notes" || !message) {
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
                });
                break;
            }
        }
    }, [
        updateDrafts,
        onCancel,
        onDelete,
        tab,
        edit,
        currentMessage,
        currentId,
        retrieved,
        conversation,
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
                    if (retrieved?.conversation_id) {
                        updateDrafts(retrieved.conversation_id, value);
                    } else {
                        setTemp(value);
                    }
                    break;
                }
            }
        },
        [updateDrafts, retrieved, type],
    );

    const placeholder = useMemo(() => {
        if (conversation?.membership.can_send === false) {
            return "Prohibited.";
        }

        switch (type) {
            case "edit": {
                return "Edit...";
            }
            case "reply": {
                return "Reply...";
            }
            default: {
                return "Send...";
            }
        }
    }, [type, conversation?.membership.can_send]);

    return useMemo(() => {
        return {
            setMessage,
            updateMessage,
            inputRef,
            message: currentMessage,
            edit,
            placeholder,
            isSendable,
        };
    }, [updateMessage, setMessage, currentMessage, edit, isSendable, placeholder]);
};
