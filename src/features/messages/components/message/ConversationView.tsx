import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { MessageList } from "@/features/messages/components/message/MessageList";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
    conversation_id?: string;
};

export const ConversationView = ({ conversation_id }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    if (!status || !conversation_id) {
        return (
            <div className="w-full h-full loading flex items-center justify-center">
                <NotSelected />
            </div>
        );
    }

    return <ConversationViewId conversation_id={conversation_id} />;
};

type IdProps = {
    conversation_id: string;
};
const ConversationViewId = ({ conversation_id }: IdProps) => {
    // react states
    const [message, setMessage] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-4 rounded-4xl">
            <ul className="box min-h-10! h-10! gap-1! p-0! items-center! flex-row!">
                <li className="ml-auto!">
                    <Button
                        onClick={() => {
                            wrapPromise("reloadMessages", async () => {
                                return queryInvalidate({
                                    key: ["messages", conversation_id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="reloadMessages" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/reload.svg"
                        />
                    </Button>
                </li>
            </ul>

            <MessageList conversation_id={conversation_id} />

            <div className="flex items-center">
                <Input
                    ref={inputRef}
                    className="bg-bg-1! not-hover:border-transparent hover:border-bg-3!"
                    placeholder="Send..."
                    value={message}
                    onChange={(value) => setMessage(value)}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        switch (e.code) {
                            case "Enter": {
                                setMessage("");
                                break;
                            }
                        }
                    }}
                />

                <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                        interpolateSize: "allow-keywords",
                        width: message ? "auto" : "0",
                        marginLeft: message ? "0.5rem" : "0",
                    }}
                >
                    <Button className="not-hover:bg-bg-1! h-full! aspect-square">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                    </Button>
                </div>
            </div>
        </article>
    );
};
