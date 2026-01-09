import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { useAppStore } from "@/zustand/store";

export const AuthRequired = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);

    return (
        <div className="flex flex-col items-center justify-center my-36">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        {promises.login === "pending" ||
                        promises.getSessions === "pending" ? (
                            <Spinner styles="big" />
                        ) : (
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/auth.svg"
                            />
                        )}
                    </div>

                    <span className="text-5! text-foreground-5!">
                        <mark>Authentication</mark> is required
                    </span>

                    <p className="max-w-100 text-center">
                        You are currently <u>not</u> authenticated or lack
                        certain permissions to view this content. <b>Contact</b>{" "}
                        us if you think there is something wrong.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Create a new account"
                        className="w-full"
                    >
                        <LinkButton
                            className="w-full"
                            href="/signup"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/pencil.svg"
                            />
                            Sign up
                        </LinkButton>
                    </Tooltip>

                    <Tooltip
                        text="Log in an existing account"
                        className="w-full"
                    >
                        <LinkButton
                            className="w-full"
                            href="/login"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/auth.svg"
                            />
                            Log in
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
