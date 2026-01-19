import { motion } from "motion/react";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBoxHotkeys } from "../hooks/useMessageBoxHotkeys";
import Image from "next/image";

type Props = {
    description: string;
    onInteract: (response: "yes" | "no") => void;
};

export const MessageBox = ({ description, onInteract }: Props) => {
    // hotkeys
    useMessageBoxHotkeys(onInteract);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col justify-between items-center fixed
             left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-4xl
              outline-2 outline-background-a-5 bg-background-a-0 backdrop-blur-2xl p-4 gap-4 w-full max-w-80"
        >
            <div className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/type.svg"
                    className="invert-60!"
                />
                <span className="text-center text-5! text-foreground-4!">
                    Are you <u>sure?</u>
                </span>
            </div>

            <span className="text-center w-full">{description}</span>

            <hr />

            <div className="grid grid-cols-2 w-full gap-2">
                <Tooltip
                    text="Confirm"
                    className="w-full"
                >
                    <Button
                        onClick={() => onInteract("yes")}
                        className="w-full gap-2!"
                    >
                        <Image
                            alt=""
                            width={12}
                            height={12}
                            src="/checkmark.svg"
                        />
                        Yes
                    </Button>
                </Tooltip>

                <Tooltip
                    text="Reject"
                    className="w-full"
                >
                    <Button
                        onClick={() => onInteract("no")}
                        className="w-full gap-2"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cross.svg"
                        />
                        No
                    </Button>
                </Tooltip>
            </div>
        </motion.div>
    );
};
