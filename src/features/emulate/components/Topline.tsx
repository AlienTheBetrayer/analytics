import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { dashboardSync } from "@/query-api/calls/dashboard";

export const Topline = () => {
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
                        alt="Emulate"
                        src="/emulate.svg"
                    />
                </span>
            </li>

            <li>
                <Tooltip text="Back to the dashboard">
                    <LinkButton href="/dashboard">
                        <Image
                            src="/back.svg"
                            alt="goback"
                            width={16}
                            height={16}
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="ml-auto!">
                <Tooltip text="Reload project data">
                    <Button
                        onClick={() => {
                            wrapPromise("dashboardSync", () => {
                                return dashboardSync({});
                            });
                        }}
                    >
                        <PromiseState state="dashboardSync" />
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/server.svg"
                        />
                        Fetch
                    </Button>
                </Tooltip>
            </li>
        </ul>
    );
};
