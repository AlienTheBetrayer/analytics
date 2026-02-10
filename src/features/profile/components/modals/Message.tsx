import { Button } from "@/features/ui/button/components/Button";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { sendMessage } from "@/query-api/calls/messages";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    hide: () => void;
    data: CacheAPIProtocol["user"]["data"] | null;
};

export const Message = ({ hide, data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const [message, setMessage] = useState<string>("");

    return (
        <div className="acrylic box p-4! gap-4! w-screen max-w-lg">
            <CloseButton hide={hide} />

            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/send.svg"
                />
                <span className="flex items-center gap-1">Messenger</span>
            </div>

            {data && (
                <form
                    className="box p-4!"
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (!status) {
                            return;
                        }

                        wrapPromise("startDm", () => {
                            return sendMessage({
                                type: "start_dm",
                                from_id: status.id,
                                to_id: data.id,
                                message: message,
                            });
                        });
                    }}
                >
                    <ul className="flex flex-col gap-4">
                        <li className="flex flex-col gap-2">
                            <label
                                htmlFor="message"
                                className="flex items-center gap-1"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/message.svg"
                                />
                                Message
                            </label>
                            <Input
                                required
                                id="message"
                                value={message}
                                onChange={(value) => setMessage(value)}
                                placeholder="Send..."
                            />
                        </li>

                        <li>
                            <Tooltip
                                text="Send & Start a conversation"
                                className="w-full"
                            >
                                <Button
                                    className="w-full"
                                    type="submit"
                                >
                                    <PromiseState state="startDm" />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/imageadd.svg"
                                    />
                                    <mark>Send</mark>
                                </Button>
                            </Tooltip>
                        </li>
                    </ul>
                </form>
            )}
            <LinkButton href="/messages">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/launch.svg"
                />
                Conversations
            </LinkButton>
        </div>
    );
};
