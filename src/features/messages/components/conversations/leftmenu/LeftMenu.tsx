import { CreateConversationElements } from "@/features/messages/components/conversations/create/CreateConversation";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"] | null;
    hide: () => void;
};

export const LeftMenu = ({ data, hide }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const localDisplay = useLocalStore((state) => state.display);
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const updateLocalDisplay = useLocalStore((state) => state.updateDisplay);

    const notesConversation = useMemo(() => {
        return data?.find((c) => c.type === "notes");
    }, [data]);

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-4! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/description.svg"
                />
            </li>

            <li>
                <LinkButton href="/profile">
                    <ProfileImage
                        profile={status?.profile}
                        width={256}
                        height={256}
                        className="w-6! h-6!"
                    />
                    <span>{status?.username}</span>
                </LinkButton>
            </li>

            <li className="w-full">
                <ul className="flex flex-col items-center gap-1 *:w-full">
                    <li className="flex items-center justify-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/plus.svg"
                        />
                        <span>Create</span>
                    </li>

                    <CreateConversationElements />
                </ul>
            </li>

            <li>
                <ul className="flex flex-col items-center gap-1 *:w-full">
                    <li className="flex items-center justify-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/arrow.svg"
                        />
                        <span>Navigation</span>
                    </li>

                    <li>
                        <LinkButton href="/messages/notes">
                            <div>
                                {notesConversation?.image_url ? (
                                    <Image
                                        alt=""
                                        fill
                                        style={{ objectFit: "cover" }}
                                        src={notesConversation.image_url}
                                        className="invert-0!"
                                    />
                                ) : (
                                    <Image
                                        alt=""
                                        src="/save.svg"
                                        width={16}
                                        height={16}
                                    />
                                )}
                            </div>

                            <span className="z-1">Notes</span>
                        </LinkButton>
                    </li>

                    <li>
                        <LinkButton href="/messages/notes/board">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/dashboard.svg"
                            />
                            <span>Noteboard</span>
                        </LinkButton>
                    </li>

                    {localDisplay?.messages?.archive?.movedToMenu && (
                        <li className="flex items-center gap-1">
                            <Button
                                onClick={() => {
                                    updateDisplay({
                                        conversations: { tab: "archive" },
                                    });
                                    hide();
                                }}
                                className="w-full"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/archive.svg"
                                />
                                <span>Archive</span>
                            </Button>

                            <Tooltip
                                text="Move back to conversations"
                                direction="top"
                            >
                                <Button
                                    className="p-0! flex! items-center! justify-center!"
                                    onClick={() => {
                                        updateLocalDisplay({
                                            messages: {
                                                archive: {
                                                    movedToMenu: false,
                                                },
                                            },
                                        });
                                    }}
                                >
                                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/back.svg"
                                    />
                                </Button>
                            </Tooltip>
                        </li>
                    )}
                </ul>
            </li>
        </ul>
    );
};
