import { AlreadySent } from "@/features/contact/components/errors/AlreadySent";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { PromiseState } from "@/promises/components/PromiseState";
import { motion } from "motion/react";
import Image from "next/image";
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

export type SendFormHandle = {
    title: React.RefObject<HTMLInputElement | null>;
    email: React.RefObject<HTMLInputElement | null>;
    message: React.RefObject<HTMLInputElement | null>;
};

export type SendFormContents = {
    title?: string;
    email?: string;
    message?: string;
};

type Props = {
    contents: SendFormContents;
    setContents: React.Dispatch<React.SetStateAction<SendFormContents>>;
    onDelete: () => void;
    onSubmit: () => void;
};

export const SendForm = forwardRef<SendFormHandle, Props>(
    function SendFormComponent(
        { onSubmit, onDelete, contents, setContents }: Props,
        ref,
    ) {
        // refs & access
        const titleRef = useRef<HTMLInputElement | null>(null);
        const emailRef = useRef<HTMLInputElement | null>(null);
        const messageRef = useRef<HTMLInputElement | null>(null);
        useImperativeHandle(ref, () => ({
            title: titleRef,
            email: emailRef,
            message: messageRef,
        }));

        const [sent, setSent] = useState<boolean>(false);

        return (
            <form
                className={`relative flex flex-col items-center w-full`}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (sent) {
                        return;
                    }

                    setSent(true);
                    onSubmit();
                }}
            >
                {sent && (
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-1/2 z-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AlreadySent />
                    </motion.div>
                )}

                <ul
                    className={`flex flex-col gap-8 w-full transition-all duration-500 ${sent ? "opacity-30" : ""}`}
                    inert={sent}
                >
                    <li className="flex flex-col gap-2 items-center">
                        <label
                            htmlFor="title"
                            className="flex justify-center items-center gap-1 w-full"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/menu.svg"
                            />
                            Title
                        </label>
                        <Input
                            ref={titleRef}
                            id="title"
                            placeholder="at least 12 characters"
                            required
                            minLength={12}
                            maxLength={128}
                            value={contents.title}
                            onChange={(value) =>
                                setContents((prev) => ({
                                    ...prev,
                                    title: value,
                                }))
                            }
                        />
                    </li>

                    <li className="flex flex-col gap-2 items-center w-full">
                        <label
                            htmlFor="email"
                            className="flex justify-center items-center gap-1 w-full"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/email.svg"
                            />
                            E-mail
                        </label>
                        <Input
                            ref={emailRef}
                            required
                            id="email"
                            type="email"
                            placeholder="a valid e-mail"
                            value={contents.email}
                            onChange={(value) =>
                                setContents((prev) => ({
                                    ...prev,
                                    email: value,
                                }))
                            }
                        />
                    </li>

                    <li className="flex flex-col gap-2 items-center">
                        <label
                            htmlFor="message"
                            className="flex justify-center items-center gap-1 w-full"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/commentadd.svg"
                            />
                            Message
                        </label>
                        <Input
                            ref={messageRef}
                            required
                            minLength={32}
                            maxLength={1024}
                            className="grow rounded-2xl! min-h-64 max-h-128"
                            as="textarea"
                            id="message"
                            placeholder="at least 32 characters"
                            value={contents.message}
                            onChange={(value) =>
                                setContents((prev) => ({
                                    ...prev,
                                    message: value,
                                }))
                            }
                        />
                    </li>

                    <li>
                        <hr />
                    </li>

                    <li className="flex flex-col items-center">
                        <ul className="grid grid-cols-2 w-full lg:max-w-lg gap-2">
                            <li>
                                <Button
                                    className="w-full"
                                    type="button"
                                    onClick={onDelete}
                                >
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/delete.svg"
                                    />
                                    Clear
                                </Button>
                            </li>

                            <li>
                                <Button
                                    className="w-full"
                                    type="submit"
                                >
                                    <PromiseState state="updateContact" />
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/send.svg"
                                    />
                                    <mark>Send</mark>
                                </Button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </form>
        );
    },
);
