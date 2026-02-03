import Image from "next/image";
import { useState } from "react";
import { Tooltip } from "../../ui/popovers/components/tooltip/Tooltip";
import { Button } from "../../ui/button/components/Button";
import { Input } from "../../ui/input/components/Input";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { AxiosResponse } from "axios";
import { motion } from "motion/react";

type Props = {
    title: string;
    button: {
        text: string;
        tooltip: string;
    };
    onSubmit: (
        username: string,
        password: string,
    ) => Promise<AxiosResponse | undefined>;
    className?: string;
    type?: "login" | "register";
};

export const AuthenticationForm = ({
    title,
    button,
    onSubmit,
    type = "login",
}: Props) => {
    // react input states
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // authentication internal states
    const [response, setResponse] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    return (
        <div className="flex flex-col gap-2 w-full max-w-7xl">
            <div className="box w-full box flex flex-row! p-0! min-h-10 h-10 items-center gap-1">
                <Tooltip
                    text="Home"
                    direction="top"
                >
                    <LinkButton
                        href="/home"
                        ariaLabel="home page"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cube.svg"
                        />
                    </LinkButton>
                </Tooltip>

                <span className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                    <Tooltip
                        text="Easter egg 🌀"
                        direction="top"
                    >
                        <div className="rounded-full bg-blue-1 w-1 h-1" />
                    </Tooltip>
                    <span>Secure</span>
                </span>
            </div>

            <div className="box w-full flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1 items-center">
                    <div className="grid place-items-center rounded-full w-10 aspect-square outline-2 outline-blue-1">
                        <Image
                            alt=""
                            width={24}
                            height={24}
                            src="/privacy.svg"
                        />
                    </div>

                    <span>{title}</span>
                </div>
                <hr />

                {/* main form */}
                <form
                    className="flex flex-col w-full min-h-64"
                    onSubmit={async (e) => {
                        e.preventDefault();

                        wrapPromise("auth", async () => {
                            const res = await onSubmit(username, password);

                            if (res?.data.message && "success" in res?.data) {
                                setResponse({
                                    message: res.data.message,
                                    success: res.data.success,
                                });
                            }

                            if (res?.data?.success !== true) {
                                throw "";
                            }

                            return res;
                        });
                    }}
                >
                    <ul className="flex flex-col gap-4 grow">
                        <li className="flex flex-col gap-2">
                            <label
                                htmlFor="username"
                                className="flex justify-between"
                            >
                                Username
                                {type === "register" && (
                                    <small>(your unique name)</small>
                                )}
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
                        </li>

                        <li>
                            <hr />
                        </li>

                        <li className="flex flex-col gap-2">
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
                        </li>

                        <li className="mt-auto!">
                            <hr />
                        </li>

                        <li className="flex flex-col gap-2">
                            <Tooltip
                                text={button.tooltip}
                                direction={"bottom"}
                                className="w-full"
                            >
                                <Button
                                    className="w-full"
                                    type="submit"
                                >
                                    <PromiseState state="auth" />

                                    <Image
                                        alt=""
                                        width={20}
                                        height={20}
                                        src="/send.svg"
                                    />
                                    {button.text}
                                </Button>
                            </Tooltip>
                        </li>
                    </ul>
                </form>

                {response?.success && (
                    <motion.div
                        className="flex flex-col gap-2 w-full mt-8"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                    >
                        <hr />
                        <Tooltip
                            text="Proceed the authentication"
                            direction="bottom"
                            className="w-full"
                        >
                            <LinkButton
                                className="w-full"
                                href="/login"
                            >
                                Redirect to log in
                            </LinkButton>
                        </Tooltip>
                    </motion.div>
                )}

                {/* status message */}
                {response && (
                    <motion.div
                        className="flex flex-col gap-2 w-full mt-8"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                    >
                        <hr />
                        <div className="flex gap-1 items-center mx-auto">
                            <div
                                className={`rounded-full w-1 h-1 ${response.success ? "bg-blue-1" : "bg-red-1"} shrink-0`}
                            />
                            <span>{response.message}</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
