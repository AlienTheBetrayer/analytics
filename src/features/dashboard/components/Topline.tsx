import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Button } from "../../ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";

export const Topline = () => {
    // zustand states
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const sync = useAppStore((state) => state.sync);

    return (
        <div
            className={`box w-full max-w-7xl mx-auto my-2 p-0! flex-row! flex-wrap transition-all duration-500 items-center h-10!`}
        >
            <div className="flex gap-1 items-center">
                <Tooltip
                    text="Go back home"
                    direction="top"
                >
                    <LinkButton
                        href="/home/"
                        className="p-0! md:px-2!"
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/cube.svg"
                        />
                        <span className="hidden md:block">Home</span>
                    </LinkButton>
                </Tooltip>

                <Tooltip
                    text="Emulate fake events"
                    direction="top"
                >
                    <LinkButton
                        href="/emulate/"
                        className="p-0! md:px-2!"
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="emulation"
                            src="/emulate.svg"
                        />
                        <span className="hidden md:block">Emulation</span>
                    </LinkButton>
                </Tooltip>

                <Tooltip
                    text="Notification centre"
                    direction="top"
                >
                    <LinkButton
                        href="/notifications/"
                        className="p-0! md:px-2!"
                    >
                        <Image
                            width={16}
                            height={16}
                            alt="notifications"
                            src="/notification.svg"
                        />
                        <span className="hidden md:block">Notifications</span>
                    </LinkButton>
                </Tooltip>
            </div>

            <span className="flex gap-1 items-center absolute left-1/2 -translate-1/2 top-1/2">
                <div className="rounded-full w-1 h-1 bg-blue-1" />
                Dashboard
            </span>

            <div className="flex gap-1 ml-auto items-center">
                <Tooltip
                    text="Re-sync all data"
                    direction="top"
                    disabledPointer
                >
                    <Button
                        onClick={() => {
                            sync({ caching: false });
                        }}
                    >
                        {promiseStatus(promises.sync)}
                        <Image
                            src="/download.svg"
                            alt=""
                            width={16}
                            height={16}
                        />
                        <mark>Sync</mark>
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};
