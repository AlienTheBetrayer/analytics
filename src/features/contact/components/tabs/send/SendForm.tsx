import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";

type Props = {
    type: "send" | "edit";
};

export const SendForm = forwardRef<{ showDeleteBox: () => void }, Props>(
    function SendFormComponent({ type }: Props, ref) {
        // react states
        const [title, setTitle] = useState<string>("");
        const [email, setEmail] = useState<string>("");
        const [message, setMessage] = useState<string>("");

        // message boxes
        const deleteBox = useMessageBox();

        // access
        useImperativeHandle(ref, () => ({ showDeleteBox: deleteBox.show }));

        return (
            <form
                className="flex flex-col items-center w-full"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {deleteBox.render({
                    children: "Everything from this form will disappear!",
                    onSelect: (res) => {
                        if (res === "yes") {
                            setTitle("");
                            setEmail("");
                            setMessage("");
                        }
                    },
                })}

                <ul className="flex flex-col gap-8 w-full">
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
                            id="title"
                            placeholder="at least 16 characters"
                            required
                            minLength={12}
                            maxLength={128}
                            value={title}
                            onChange={(value) => setTitle(value)}
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
                            required
                            id="email"
                            type="email"
                            placeholder="a valid e-mail"
                            value={email}
                            onChange={(value) => setEmail(value)}
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
                            required
                            minLength={32}
                            className="grow rounded-2xl! min-h-64 max-h-128"
                            as="textarea"
                            id="message"
                            placeholder="at least 32 characters"
                            value={message}
                            onChange={(value) => setMessage(value)}
                        />
                    </li>

                    <li>
                        <hr />
                    </li>

                    <li className="flex flex-col items-center">
                        <ul className="grid grid-cols-2 w-full md:max-w-96 gap-2">
                            <li>
                                <Button
                                    className="w-full"
                                    type="button"
                                    onClick={deleteBox.show}
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
