/** @format */

import { useArchivedDisplay } from "@/features/messages/components/conversations/archived/useArchivedDisplay";
import { BottomButtons } from "@/features/messages/components/conversations/display/parts/BottomButtons";
import { Name } from "@/features/messages/components/conversations/display/parts/Name";
import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import React from "react";

type Props = {
    archivedIds: string[];
};

export const ArchivedDisplay = ({ archivedIds }: Props) => {
    // zustand
    const display = useLocalStore((state) => state.display.messages);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    // 3 conversations (to then get their title)
    const threeConversations = useArchivedDisplay(archivedIds);

    // fallback
    if (display?.archive?.movedToMenu === true || !threeConversations?.length) {
        return null;
    }

    // ui states
    const isCollapsed = display?.archive?.collapsed === true;

    // jsx
    return (
        <div className="relative">
            <Button
                onClick={() => {
                    updateDisplay({
                        conversations: { tab: "archive" },
                    });
                }}
                className={`box not-hover:bg-bg-1! w-full p-4! flex-row! rounded-4xl! duration-300! justify-start! gap-4!
                    ${isCollapsed ? "h-10! items-center!" : "h-20! items-start!"}`}
            >
                <div
                    className={`relative rounded-2xl w-full h-full transition-all duration-300 flex items-center justify-center 
                            bg-linear-to-bl from-bg-3 to-bg-5 shrink-0 max-w-12 max-h-12
                        ${isCollapsed ? "from-transparent to-transparent!" : ""}`}
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

                    <span className={`transition-all duration-300 ${isCollapsed ? "max-h-0" : "max-h-24"}`}>
                        <small className="flex items-center">
                            {threeConversations.slice(0, 3).map((c, k, arr) => (
                                <React.Fragment key={c.id}>
                                    <Name conversation={c} />
                                    {k < arr.length - 1 && <span className="mr-1">,</span>}
                                </React.Fragment>
                            ))}
                        </small>
                    </span>
                </div>
            </Button>

            <BottomButtons
                isCollapsed={isCollapsed}
                type="archived"
            />
        </div>
    );
};
