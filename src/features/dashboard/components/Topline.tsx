import Image from "next/image";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Button } from "../../ui/button/components/Button";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { dashboardSync } from "@/query-api/calls/dashboard";

export const Topline = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    return (
        <ul
            className={`box w-full max-w-400 mx-auto! sticky! top-4 z-2 my-2! p-0! flex-row! gap-1! flex-wrap transition-all duration-500 items-center h-10!`}
        >
            <li className="absolute left-1/2 -translate-1/2 top-1/2">
                <span className="flex gap-1 items-center">
                    <div className="rounded-full w-1 h-1 bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt="Dashboard"
                        src="/dashboard.svg"
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Home">
                    <LinkButton href="/home/">
                        <Image
                            width={16}
                            height={16}
                            alt="home"
                            src="/cube.svg"
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="self-stretch flex items-center">
                <hr className="w-px! h-1/3! bg-background-6" />
            </li>

            <li>
                <Tooltip text="Emulate fake events">
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
                    </LinkButton>
                </Tooltip>
            </li>

            <li>
                <Tooltip text="Notification centre">
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
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="ml-auto!">
                <div className="flex gap-1 items-center">
                    <Tooltip text="Re-sync all data">
                        <Button
                            onClick={() => {
                                wrapPromise("dashboardSync", () => {
                                    return dashboardSync({ selectedProjectId });
                                });
                            }}
                        >
                            <PromiseState state="dashboardSync" />
                            <Image
                                src="/server.svg"
                                alt=""
                                width={16}
                                height={16}
                            />
                        </Button>
                    </Tooltip>
                </div>
            </li>
        </ul>
    );
};
