import { ContextMenu } from "@/features/messages/components/conversations/archived/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const ArchivedDisplay = () => {
    const display = useLocalStore((state) => state.display.messages);

    return (
        <div className="relative">
            <Button className="box not-hover:bg-bg-1! w-full p-4! flex-row! rounded-4xl! justify-start! items-start! gap-4!">
                <div className="rounded-full w-12 h-12 flex items-center justify-center bg-bg-3 shrink-0">
                    <Image
                        alt="archive"
                        width={24}
                        height={24}
                        src="/archive.svg"
                    />
                </div>

                <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
                    <span>Archived chats</span>

                    <span>
                        <small>hi</small>
                        {String(display?.archive?.collapsed)}
                        {String(display?.archive?.movedToMenu)}
                    </span>
                </div>
            </Button>

            <div className="absolute right-4 bottom-2">
                <Modal
                    element={() => <ContextMenu />}
                    direction="right"
                >
                    <Button className="min-w-6! min-h-6! h-6! w-6! p-0!">
                        <Image
                            alt=""
                            width={12}
                            height={12}
                            src="/menu.svg"
                        />
                    </Button>
                </Modal>
            </div>
        </div>
    );
};
