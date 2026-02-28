import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { upsertNoteboard } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    type: "edit" | "create";
    data?: CacheAPIProtocol["noteboards"]["data"][number] | null;
};

export const CreateBoard = ({ type, data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const [title, setTitle] = useState<string>(
        type === "edit" && data ? data.title : "",
    );
    const [description, setDescription] = useState<string>(
        type === "edit" && data?.description ? data.description : "",
    );

    return (
        <div className="box acrylic p-4! rounded-2xl! gap-1! w-full">
            <div className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/dashboard.svg"
                />
                <span>{type === "edit" ? "Edit" : "Create"}</span>
            </div>

            <form
                className="flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();

                    if (!status) {
                        return;
                    }

                    wrapPromise("createNoteboard", () => {
                        switch (type) {
                            case "create": {
                                return upsertNoteboard({
                                    type: "create",
                                    user_id: status.id,
                                    title: title,
                                    ...(description && { description }),
                                });
                            }
                            case "edit": {
                                if (!data) {
                                    return Promise.reject();
                                }

                                return upsertNoteboard({
                                    type: "edit",
                                    user_id: status.id,
                                    title: title,
                                    ...(description && { description }),
                                    noteboard_id: data.id,
                                });
                            }
                        }
                    });
                }}
            >
                <ul className="flex flex-col gap-2">
                    <li>
                        <Input
                            required
                            minLength={4}
                            placeholder="title"
                            value={title}
                            onChange={(value) => setTitle(value)}
                        />
                    </li>

                    <li>
                        <Input
                            maxLength={48}
                            placeholder="description (optional)"
                            value={description}
                            onChange={(value) => setDescription(value)}
                        />
                    </li>

                    <li>
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <PromiseState state="createNoteboard" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/imageadd.svg"
                            />
                            <span>{type === "edit" ? "Edit" : "Create"}</span>
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
