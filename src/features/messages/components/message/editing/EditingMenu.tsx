import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["messages"]["data"];
};

export const EditingMenu = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // states
    const [title, setTitle] = useState<string>(data.title ?? "");
    const [description, setDescription] = useState<string>(data.description ?? "");

    return (
        <div className="box p-4! acrylic w-screen max-w-96">
            <span className="flex items-center justify-center gap-1 mb-6!">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/pencil.svg"
                />
            </span>

            <form
                className="w-full"
                onSubmit={(e) => {
                    e.preventDefault();

                    if (!status || !data) {
                        return;
                    }

                    wrapPromise("updateConversation", () => {
                        return upsertConversation({
                            type: "edit",
                            user: status,
                            conversation_id: data?.id,
                            ...(title && { title }),
                            ...(description && { description }),
                        });
                    });
                }}
            >
                <ul className="flex flex-col items-center gap-2 w-full *:w-full">
                    <li>
                        <Input
                            placeholder="title..."
                            value={title}
                            onChange={(value) => setTitle(value)}
                        />
                    </li>

                    <li>
                        <Input
                            placeholder="description..."
                            value={description}
                            onChange={(value) => setDescription(value)}
                        />
                    </li>

                    <li className="my-1!">
                        <hr />
                    </li>

                    <li>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <PromiseState state="updateConversation"/>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/pencil.svg"
                            />
                            Save changes
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
