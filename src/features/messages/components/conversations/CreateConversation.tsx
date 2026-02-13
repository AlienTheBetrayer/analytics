import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import Image from "next/image";

export const CreateConversation = () => {
    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/save.svg"
                    />
                    <span>Notes</span>
                </Button>
            </li>

            <li>
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => (
                        <MiniSearch
                            type="friends"
                            view="select"
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
                        <div className="flex justify-between items-center w-full gap-1">
                            <span>Friends</span>
                            <Image
                                className="-scale-100"
                                alt=""
                                width={16}
                                height={16}
                                src="/prev.svg"
                            />
                        </div>
                    </Button>
                </Modal>
            </li>

            <li>
                <Modal
                    className="w-full"
                    direction="right"
                    element={() => (
                        <MiniSearch
                            type="users"
                            view="select"
                        />
                    )}
                >
                    <Button>
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/account.svg"
                        />
                        <div className="flex justify-between items-center w-full gap-1">
                            <span>Users</span>
                            <Image
                                className="-scale-100"
                                alt=""
                                width={16}
                                height={16}
                                src="/prev.svg"
                            />
                        </div>
                    </Button>
                </Modal>
            </li>
        </ul>
    );
};
