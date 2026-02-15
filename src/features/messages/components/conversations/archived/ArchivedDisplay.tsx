import { ContextMenu } from "@/features/messages/components/conversations/archived/ContextMenu";
import { Name } from "@/features/messages/components/conversations/display/Name";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import React from "react";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"];
};

export const ArchivedDisplay = ({ data }: Props) => {
    const display = useLocalStore((state) => state.display.messages);
    const isCollapsed = display?.archive?.collapsed === true;
    const updateMessagesDisplay = useAppStore(
        (state) => state.updateMessagesDisplay,
    );

    return (
        display?.archive?.movedToMenu === false && (
            <div className="relative">
                <Button
                    onClick={() => {
                        updateMessagesDisplay({
                            tabs: { conversations: "archive" },
                        });
                    }}
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
                            <small className="flex items-center">
                                {data.slice(0, 3).map((c, k, arr) => (
                                    <React.Fragment key={c.id}>
                                        <Name data={c} />
                                        {k < arr.length - 1 && (
                                            <span className="mr-1">,</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </small>
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
