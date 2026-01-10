import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const AbsentNotification = () => {
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
                        <u>Absent</u> notification
                    </span>

                    <p className="max-w-100 text-center">
                        The notification you have selected is, for some reason,
                        absent. Re-check the URL or if you even have any
                        notifications in the first place.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-1 items-center w-full">
                    <Tooltip
                        text="Go to notifications"
                        className="w-full"
                    >
                        <LinkButton
                            href="/notifications"
                            className="w-full"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/send.svg"
                            />
                            Notification centre
                        </LinkButton>
                    </Tooltip>

                    <Tooltip
                        text="Go to home"
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
                </div>
            </div>
        </div>
    );
};
