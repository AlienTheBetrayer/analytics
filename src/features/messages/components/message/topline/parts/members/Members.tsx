import { AddFriends } from "@/features/messages/components/message/topline/parts/members/AddFriends";
import { MembersList } from "@/features/messages/components/message/topline/parts/members/MembersList";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const Members = ({ conversationData }: Props) => {
    const [tab, setTab] = useState<"list" | "add">("list");

    return (
        <div className="box p-4! gap-4! items-center acrylic">
            <Tooltip
                className="absolute! right-11 top-1.75"
                direction="top"
                text={tab === "add" ? "List" : "Add"}
            >
                <Button
                    className="p-0! rounded-lg! w-6! h-6! min-h-6! min-w-6!"
                    onClick={() => {
                        setTab((prev) => (prev === "list" ? "add" : "list"));
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={tab === "list" ? "/cubeadd.svg" : "/cubes.svg"}
                    />
                </Button>
            </Tooltip>

            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/friends.svg"
                />
                Members
            </span>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.15 }}
                    className="flex flex-col grow *:grow w-full"
                >
                    {tab === "add" ? (
                        <AddFriends conversationData={conversationData} />
                    ) : (
                        <MembersList conversationData={conversationData} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
