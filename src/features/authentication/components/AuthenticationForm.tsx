"use client";
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
import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import { usePathname } from "next/navigation";

type Props = {
    title: string;
    button: {
        text: string;
        tooltip: string;
    };
    onSubmit: (username: string, password: string) => Promise<AxiosResponse | undefined>;
    className?: string;
    type?: "login" | "register";
};

export const AuthenticationForm = ({ title, button, onSubmit, type = "login" }: Props) => {
    // url
    const pathname = usePathname();
    const isSignUp = pathname === "/signup";

    // react input states
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [valid, setValid] = useState<boolean>(false);

    // authentication internal states
    const [response, setResponse] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm">
            <div className="box w-full box flex flex-row! p-0! min-h-10 h-10 items-center gap-1 loading">
                <Tooltip text="Home">
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

            <div className="box w-full flex flex-col items-center gap-2! p-4!">
                <div className="flex relative w-full h-48">
                    <ThreeContainer className="p-4! grow h-full" />
                    <span className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={20}
                            height={20}
                            src="/privacy.svg"
                        />
                        <span>{title}</span>
                    </span>
                </div>

                <hr className="my-2!" />

                {/* main form */}
                <form
                    className="flex flex-col w-full"
                    onChange={(e) => {
                        setValid(e.currentTarget.checkValidity());
                    }}
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
                    <ul className="flex flex-col gap-2 grow">
                        <li className="flex flex-col gap-2">
                            <Input
                                id="username"
                                value={username}
                                placeholder="Username..."
                                onChange={(value) => setUsername(value)}
                                type="text"
                                aria-label="Username"
                                required
                                minLength={6}
                            />
                        </li>

                        <li className="flex flex-col gap-2">
                            <Input
                                id="password"
                                value={password}
                                placeholder="Password..."
                                onChange={(value) => setPassword(value)}
                                type="password"
                                aria-label="Password"
                                required
                                minLength={6}
                            />
                        </li>

                        <li>
                            <hr className="my-1!" />
                        </li>

                        <li className="flex flex-col gap-2 mt-auto!">
                            <Tooltip
                                text={button.tooltip}
                                direction={"bottom"}
                                className="w-full"
                            >
                                <Button
                                    className="w-full"
                                    type="submit"
                                >
                                    <div
                                        className="w-1 h-1 rounded-full transition-all duration-500"
                                        style={{ background: valid ? "var(--blue-1)" : "var(--red-1)" }}
                                    />
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

                <div className="flex flex-col mt-auto! w-full">
                    <Tooltip
                        text="Proceed the authentication"
                        direction="bottom"
                        className="w-full"
                    >
                        <LinkButton
                            className="w-full"
                            href={isSignUp ? "/login" : "/signup"}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/launch.svg"
                            />
                            <span>{isSignUp ? "Redirect to log in" : "Redirect to sign up"}</span>
                        </LinkButton>
                    </Tooltip>
                </div>

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
