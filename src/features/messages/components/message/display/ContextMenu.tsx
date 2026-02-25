import { PromiseState } from "@/promises/components/PromiseState";
import "../ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { deleteMessage } from "@/query-api/calls/messages";
import { useQuery } from "@/query/core";

type Props = {
    hide?: () => void;
    onEdit?: () => void;
    onReply?: () => void;
    data: CacheAPIProtocol["messages"]["data"][number];
};

export const ContextMenu = ({ hide, data, onEdit, onReply }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    const isOurs = data.user_id === status?.id;

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/settings.svg"
                />
            </li>

            {data.type !== "system" && (
                <>
                    <li>
                        <Button
                            onClick={() => {
                                hide?.();
                                onReply?.();
                            }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                            <span>Reply</span>
                        </Button>
                    </li>

                    {isOurs && (
                        <li>
                            <Button
                                onClick={() => {
                                    hide?.();
                                    onEdit?.();
                                }}
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                                <span>Edit</span>
                            </Button>
                        </li>
                    )}

                    <li>
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/pin.svg"
                            />
                            <span>Pin</span>
                        </Button>
                    </li>
                </>
            )}

            <li>
                <Button
                    onClick={() => {
                        wrapPromise("saveClipboard", () => {
                            return navigator.clipboard.writeText(data.message);
                        });
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/copy.svg"
                    />
                    <span className="flex items-center gap-1">
                        <PromiseState state="saveClipboard" />
                        <span>Copy</span>
                    </span>
                </Button>
            </li>

            {data.type !== "system" && (
                <>
                    <li>
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                                className="-scale-x-100"
                            />
                            <span>Forward</span>
                        </Button>
                    </li>

                    <li>
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/select.svg"
                            />
                            <span>Select</span>
                        </Button>
                    </li>
                </>
            )}

            {isOurs && (
                <li>
                    <Button
                        onClick={() => {
                            deleteMessage({ message: data });
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                        <span>
                            <u>Delete</u>
                        </span>
                    </Button>
                </li>
            )}
        </ul>
    );
};
