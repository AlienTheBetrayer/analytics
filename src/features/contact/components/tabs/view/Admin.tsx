import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateContact } from "@/query-api/calls/contact";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["contact_message"]["data"];
};

export const ResponseAdmin = ({ data }: Props) => {
    // react states
    const [response, setResponse] = useState<string>(data?.response ?? "");

    const deleteBox = useMessageBox();

    return (
        <div className="box rounded-4xl! grow p-2! items-center gap-2!">
            {deleteBox.render({
                children:
                    "The response will be deleted and the user won't be able to see it.",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("deleteResponse", () => {
                            return updateContact({
                                type: "edit",
                                message_id: data.id,
                                response: null,
                            });
                        });
                    }
                },
            })}

            <ul className="box bg-bg-2! h-10! p-0! flex-row! items-center! w-full">
                <li className="absolute left-1/2 top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Response:
                    </span>
                </li>

                <li className="ml-auto!">
                    <Tooltip
                        text="Undo"
                        isEnabled={!!data?.response}
                    >
                        <Button onClick={deleteBox.show}>
                            <PromiseState state="deleteResponse" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <form
                className="flex flex-col gap-2 grow w-full items-center"
                onSubmit={(e) => {
                    e.preventDefault();
                    wrapPromise("response", () => {
                        return updateContact({
                            type: "edit",
                            message_id: data?.id,
                            response,
                        });
                    });
                }}
            >
                <Input
                    placeholder="user will see this"
                    value={response}
                    required
                    maxLength={256}
                    onChange={(value) => setResponse(value)}
                    as="textarea"
                    container={{
                        style: {
                            display: "grid",
                            flex: "1",
                            gridTemplateColumns: "1fr",
                        },
                    }}
                    className="resize-none! rounded-2xl! self-stretch"
                />

                <ul className="grid grid-cols-2 w-full max-w-96 gap-4">
                    <li>
                        <Tooltip
                            className="w-full"
                            text="Clear contents"
                            isEnabled={!!response.length}
                        >
                            <Button
                                onClick={() => {
                                    setResponse("");
                                }}
                                className="w-full"
                                type="button"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/delete.svg"
                                />
                                Clear
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip
                            className="w-full"
                            text="Send a response"
                        >
                            <Button
                                className="w-full"
                                type="submit"
                            >
                                <PromiseState state="response" />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src={`${data?.response ? "/pencil.svg" : "/send.svg"}`}
                                />
                                <mark>{data?.response ? "Edit" : "Send"}</mark>
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </form>
        </div>
    );
};
