import { ContextMenu } from "@/features/messages/components/conversations/archived/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const ArchivedDisplay = () => {
    const display = useLocalStore((state) => state.display.messages);
    const isCollapsed = display?.archive?.collapsed === true;

    return (
        display?.archive?.movedToMenu === false && (
            <div className="relative">
                <Button
                    className={`box not-hover:bg-bg-1! w-full p-4! flex-row! rounded-4xl! duration-300! justify-start! gap-4!
                    ${isCollapsed ? "h-10! items-center!" : "h-20! items-start!"}`}
                >
                    <div
                        className={`relative rounded-full transition-all duration-300 flex items-center justify-center bg-bg-3 shrink-0
                        ${isCollapsed ? "w-fit h-fit" : "w-12 h-12"}`}
                        style={{
                            interpolateSize: "allow-keywords",
                        }}
                    >
                        <Image
                            alt="archive"
                            src="/archive.svg"
                            width={24}
                            height={24}
                            className={`duration-300! ${isCollapsed ? "w-4! h-4! opacity-50" : "w-6! h-6! opacity-100"}`}
                        />
                    </div>

                    <div
                        className={`flex flex-col items-start w-full overflow-hidden ${isCollapsed ? "gap-0 opacity-50" : "gap-1 opacity-100"}`}
                    >
                        <span>Archived chats</span>

                        <span
                            className={`transition-all duration-300 ${isCollapsed ? "h-0" : "h-fit"}`}
                            style={{
                                interpolateSize: "allow-keywords",
                            }}
                        >
                            <small>hi</small>
                        </span>
                    </div>
                </Button>

                <div
                    className={`absolute right-4 bottom-2 translate-y-0 transition-all duration-300
                    ${isCollapsed ? "translate-y-1/2! bottom-1/2!" : ""}`}
                >
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
        )
    );
};
