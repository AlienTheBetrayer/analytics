import { Create } from "@/features/messages/components/message/topline/parts/invites/Create";
import { List } from "@/features/messages/components/message/topline/parts/invites/List";
import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export type InvitesTab = "list" | "create";

export const CreateInvites = ({ conversationData }: Props) => {
    const [tab, setTab] = useState<InvitesTab>("list");

    return (
        <div className="box acrylic p-4! gap-4! items-center w-screen max-w-lg min-h-72">
            <Tooltip
                className="absolute! right-11 top-1.75"
                direction="top"
                text={tab === "create" ? "Create" : "List"}
            >
                <Button
                    className="p-0! rounded-lg! w-6! h-6! min-h-6! min-w-6!"
                    onClick={() => {
                        setTab((prev) => (prev === "list" ? "create" : "list"));
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={tab === "create" ? "/cubeadd.svg" : "/cubes.svg"}
                    />
                </Button>
            </Tooltip>

            <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-1 rounded-full" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/link.svg"
                    />
                    <span>Invitations</span>
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.2 }}
                    className="flex flex-col grow *:grow w-full"
                >
                    {tab === "create" ? (
                        <Create conversationData={conversationData} />
                    ) : (
                        <List
                            conversationData={conversationData}
                            onNavigate={() => {
                                setTab("create");
                            }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
