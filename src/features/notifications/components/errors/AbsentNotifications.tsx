import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const AbsentNotifications = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex flex-col gap-8 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/send.svg"
                        />
                    </div>

                    <span className="text-5! text-foreground-5!">
                        <u>Absent</u> notifications
                    </span>

                    <p className="max-w-100 text-center">
                        Currently you have <u>no</u> notifications on the
                        current tab, <mark>interact</mark> with the application
                        for them to appear here
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-1 items-center w-full">
                    <Tooltip
                        text="Go back home"
                        className="w-full"
                    >
                        <LinkButton
                            href="/home"
                            className="w-full"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/cube.svg"
                            />
                            Home
                        </LinkButton>
                    </Tooltip>

                    <Tooltip
                        text="Go to your profile"
                        className="w-full"
                    >
                        <LinkButton
                            href="/profile"
                            className="w-full"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/account.svg"
                            />
                            Profile
                        </LinkButton>
                    </Tooltip>

                    <Tooltip
                        text="Go to the dashboard"
                        className="w-full"
                    >
                        <LinkButton
                            href="/dashboard"
                            className="w-full"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/dashboard.svg"
                            />
                            Dashboard
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
