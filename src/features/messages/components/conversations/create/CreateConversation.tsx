import { CreateType } from "@/features/messages/components/conversations/create/CreateType";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import Image from "next/image";

export const CreateConversation = () => {
    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-full message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
            </li>

            <CreateConversationElements />
        </ul>
    );
};

export const CreateConversationElements = () => {
    return (
        <>
            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    tooltipClassName="w-screen max-w-72"
                    element={() => (
                        <CreateType
                            category="group"
                            type="friends"
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/friends.svg"
                        />
                        <span>Group</span>
                    </Button>
                </Modal>
            </li>

            <li className="w-full">
                <Modal
                    className="w-full"
                    direction="right"
                    tooltipClassName="w-screen max-w-72"
                    element={() => (
                        <CreateType
                            category="channel"
                            type="friends"
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/book.svg"
                        />
                        <span>Channel</span>
                    </Button>
                </Modal>
            </li>
        </>
    );
};
