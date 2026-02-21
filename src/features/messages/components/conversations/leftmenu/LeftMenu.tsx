import { CreateConversation } from "@/features/messages/components/conversations/create/CreateConversation";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    hide: () => void;
};

export const LeftMenu = ({ hide }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const display = useAppStore((state) => state.display.conversations);
    const localDisplay = useLocalStore((state) => state.display);
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const updateLocalDisplay = useLocalStore((state) => state.updateDisplay);

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-2! **:border-0! w-screen max-w-64 message-ctx">
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

                    {localDisplay?.messages?.archive?.movedToMenu &&
                        display.tab === "archive" && (
                            <Tooltip text="Move back to conversations">
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
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/settings.svg"
                                    />
                                </Button>
                            </Tooltip>
                        )}
                </li>
            )}

            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => <CreateConversation />}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/plus.svg"
                        />
                        <span>Create</span>
                    </Button>
                </Modal>
            </li>

            <li>
                <LinkButton href="/messages/notes">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/save.svg"
                    />
                    <span>Notes</span>
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
                    <span>Note Board</span>
                </LinkButton>
            </li>
        </ul>
    );
};
