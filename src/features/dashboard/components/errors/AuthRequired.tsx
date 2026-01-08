import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const AuthRequired = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-30">
            <div className="flex flex-col gap-8 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Spinner/>
                    </div>

                    <span className="text-5! text-foreground-5!">
                        <u>Unauthenticated</u>
                    </span>

                    <p className="max-w-100 text-center">
                        Currently you are unauthenticated or <u>lacking</u>{" "}
                        certain permissions to view the analytics{" "}
                        <mark>data</mark>. <b>Contact</b> us for the details.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Create an account"
                        className="w-full"
                    >
                        <LinkButton href="/signup">
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
                        <LinkButton href="/login">
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/security.svg"
                            />
                            Log in
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
