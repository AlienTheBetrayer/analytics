import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Tooltip } from "../../tooltip/components/Tooltip";
import { Button } from "../../ui/button/components/Button";
import { Input } from "../../ui/input/components/Input";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { ResponseLogin } from "@/types/api/responses/auth";
import { useAppStore } from "@/zustand/store";
import { promiseStatus } from "@/utils/other/status";

type Props = {
    title: string;
    button: {
        text: string;
        tooltip: string;
    };
    onSubmit: (username: string, password: string) => Promise<ResponseLogin>;
    className?: string;
    type?: "login" | "register";
};

export const AuthenticationForm = ({
    title,
    button,
    onSubmit,
    className,
    type = "login",
}: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);

    // input states
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // authentication internal states
    const [response, setResponse] = useState<ResponseLogin | undefined>();

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={`flex flex-col max-w-3xl w-full z-2
                 duration-300 ease-out box
                 ${className ?? ""}`}
        >
            <div className="w-full flex justify-center items-center">
                <Image
                    alt=""
                    width={20}
                    height={20}
                    src={`${type === "login" ? "/security.svg" : "/pencil.svg"}`}
                />
            </div>

            {/* topline */}
            <div className="relative gap-2 flex flex-wrap items-center w-full border-b border-b-background-5 p-2">
                <Image
                    alt=""
                    width={20}
                    height={20}
                    src="/privacy.svg"
                />

                <Tooltip
                    text="Easter egg 🌀"
                    direction="top"
                >
                    <div className="rounded-full bg-blue-1 w-1.5 h-1.5" />
                </Tooltip>

                <span className="text-foreground-5!">{title}</span>

                <Tooltip
                    text="Come back home"
                    className="ml-auto"
                    direction="top"
                    disabledPointer
                >
                    <LinkButton
                        className="ml-auto"
                        href="/home"
                    >
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/back.svg"
                        />
                        Back
                    </LinkButton>
                </Tooltip>
            </div>

            {/* main form */}
            <form
                className="flex flex-col gap-3 p-2"
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (e.currentTarget.checkValidity()) {
                        const res = await onSubmit(username, password);
                        setResponse(res);
                    }
                }}
            >
                <label
                    htmlFor="username"
                    className="flex justify-between"
                >
                    Username
                    {type === "register" && <small>(your unique name)</small>}
                </label>
                <Input
                    id="username"
                    value={username}
                    placeholder={"at least 6 characters"}
                    onChange={(value) => setUsername(value)}
                    type="text"
                    aria-label="Username"
                    required
                    minLength={6}
                />
                <hr />

                <label
                    htmlFor="password"
                    className="flex justify-between"
                >
                    Password
                    {type === "register" && (
                        <small>(create a strong password)</small>
                    )}
                </label>
                <Input
                    id="password"
                    value={password}
                    placeholder={"at least 6 characters"}
                    onChange={(value) => setPassword(value)}
                    type="password"
                    aria-label="Password"
                    required
                    minLength={6}
                />
                <hr />

                <Tooltip
                    text={button.tooltip}
                    direction={"bottom"}
                    className="w-full"
                    disabledPointer
                >
                    <Button
                        className="w-full"
                        type="submit"
                    >
                        {promises.login && promiseStatus(promises.login)}
                        {promises.register && promiseStatus(promises.register)}

                        <Image
                            alt=""
                            width={20}
                            height={20}
                            src="/send.svg"
                        />
                        {button.text}
                    </Button>
                </Tooltip>
            </form>

            {response?.type === "user_registered" && (
                <>
                    <hr />
                    <Tooltip
                        text="Proceed the authentication"
                        direction="bottom"
                        disabledPointer
                        className="w-full"
                    >
                        <LinkButton
                            className="w-full"
                            href="/login"
                        >
                            Redirect to log in
                        </LinkButton>
                    </Tooltip>
                </>
            )}

            {/* status message */}
            {response && (
                <>
                    <hr />
                    <div className="flex gap-2 items-center mx-auto">
                        <div
                            className={`rounded-full w-2 h-2 ${response.type ? "bg-blue-1" : "bg-red-1"} shrink-0`}
                        />
                        <span>
                            {response.response?.data.error || response.message}
                        </span>
                    </div>
                </>
            )}
        </motion.div>
    );
};
