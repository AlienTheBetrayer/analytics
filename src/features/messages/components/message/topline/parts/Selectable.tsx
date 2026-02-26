import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { deleteMessage } from "@/query-api/calls/messages";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";
import Image from "next/image";

export const Selectable = () => {
    const { data: status } = useQuery({ key: ["status"] });
    const display = useAppStore((state) => state.display.messages);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    const deleteBox = useMessageBox();

    return (
        <>
            {deleteBox.render({
                children: "Selected messages will be deleted!",
                onSelect(response) {
                    if (!status) {
                        return;
                    }

                    const messages = Array.from(display.selecting.values());

                    if (!messages.length) {
                        return;
                    }

                    if (response === "yes") {
                        deleteMessage({ message: messages, user: status });
                    }
                },
            })}

            <motion.ul
                className="absolute! z-2 right-0 left-0 box gap-1! p-0! items-center! flex-row! overflow-hidden"
                initial={{ height: "0rem", opacity: 0 }}
                animate={{ height: "2.5rem", opacity: 1 }}
                exit={{ height: "0rem", opacity: 0 }}
                transition={{ ease: [0.4, 0, 0.2, 1], duration: 0.3 }}
            >
                <li>
                    <span className="flex items-center gap-1 bg-bg-2 border-bg-3 border rounded-full h-8 px-4 ml-2">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/select.svg"
                        />
                        <span>Selected: {display.selecting.size}</span>
                    </span>
                </li>

                <li>
                    <Tooltip text="Forward">
                        <Button>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/arrow.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip text="Delete">
                        <Button onClick={deleteBox.show}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Cancel">
                        <Button
                            onClick={() => {
                                updateDisplay({
                                    messages: { selecting: new Set() },
                                });
                            }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cross.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </motion.ul>
        </>
    );
};
