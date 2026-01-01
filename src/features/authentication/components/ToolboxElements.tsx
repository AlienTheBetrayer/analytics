import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const ToolboxElements = () => {
    return (
        <div className="box h-full min-w-64">
            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-1 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/server.svg"
                        />
                        <span>
                            <b>Authentication</b>
                        </span>
                    </div>
                    <p>Choose your path!</p>
                </div>

                <hr />

                <div className="flex flex-col gap-1">
                    <Tooltip
                        direction="left"
                        text="Create your account!"
                        className="w-full"
                    >
                        <LinkButton href="/signup" className="w-full">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/pencil.svg"
                            />
                            Sign up
                        </LinkButton>
                    </Tooltip>

                    <Tooltip
                        direction="left"
                        text="Log in an existing account!"
                        className="w-full"
                    >
                        <LinkButton href="/login" className="w-full">
                            <Image
                                alt=""
                                width={16}
                                height={16}
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
