import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { upsertNote } from "@/query-api/calls/notes";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number];
};

export const BoardInput = ({ data }: Props) => {
    // react states
    const [title, setTitle] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);

    // validation
    const [isSendable, setIsSendable] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsSendable(formRef.current?.checkValidity() ?? false);
        });
    }, [title]);

    return (
        <form
            ref={formRef}
            className="flex items-center gap-1 w-full"
            onSubmit={(e) => {
                e.preventDefault();

                wrapPromise("upsertNote", () => {
                    const promise = upsertNote({
                        type: "create",
                        title,
                        checked,
                        noteboard_id: data.id,
                        user_id: data.user_id,
                    });

                    setTitle("");
                    setChecked(false);

                    return promise;
                });
            }}
        >
            <Checkbox
                className="w-fit!"
                value={checked}
                onToggle={(flag) => setChecked(flag)}
            />
            <Input
                required
                minLength={4}
                placeholder="Add..."
                className="w-full"
                value={title}
                onChange={(value) => setTitle(value)}
            />

            <Button
                type="submit"
                isEnabled={isSendable}
            >
                <AnimatePresence>
                    {isSendable ? (
                        <motion.div
                            key="sendable"
                            className="absolute"
                            initial={{
                                x: -20,
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -20, opacity: 0, scale: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/plus.svg"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="notsendable"
                            className="absolute"
                            initial={{
                                x: 20,
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 20, opacity: 0, scale: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/cross.svg"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
        </form>
    );
};
