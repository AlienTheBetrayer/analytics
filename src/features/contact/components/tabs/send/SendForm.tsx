import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import Image from "next/image";

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

export const SendForm = ({ onSubmit, onDelete, contents, setContents }: Props) => {
    return (
        <form
            className="flex flex-col items-center w-full"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
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
                        value={contents.title}
                        onChange={(value) =>
                            setContents((prev) => ({ ...prev, title: value }))
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
                        required
                        id="email"
                        type="email"
                        placeholder="a valid e-mail"
                        value={contents.email}
                        onChange={(value) =>
                            setContents((prev) => ({ ...prev, email: value }))
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
                        required
                        minLength={32}
                        className="grow rounded-2xl! min-h-64 max-h-128"
                        as="textarea"
                        id="message"
                        placeholder="at least 32 characters"
                        value={contents.message}
                        onChange={(value) =>
                            setContents((prev) => ({ ...prev, message: value }))
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
};
