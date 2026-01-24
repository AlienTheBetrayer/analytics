import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";

export const Topline = () => {
    // url
    const { id } = useParams<{ id: string | undefined }>();

    // zustand
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

    return (
        <ul
            className={`box w-full max-w-7xl mx-auto! sticky! top-4 z-2 my-2! p-0! flex-row! gap-1! flex-wrap transition-all duration-500 items-center h-10!`}
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
                            src="/dashboard.svg"
                            alt="goback"
                            width={16}
                            height={16}
                        />
                    </LinkButton>
                </Tooltip>
            </li>

            {id && (
                <li className="self-stretch flex items-center">
                    <hr className="w-px! h-1/3! bg-background-6" />
                </li>
            )}

            {id && (
                <li>
                    <Tooltip text="Deselect a project">
                        <LinkButton href="/emulate">
                            <Image
                                src="/select.svg"
                                alt="deselect"
                                width={14}
                                height={14}
                            />
                        </LinkButton>
                    </Tooltip>
                </li>
            )}

            <li className="ml-auto!">
                <Tooltip text="Reload project data">
                    <Button
                        onClick={() => {
                            sync({ caching: false });
                        }}
                    >
                        <PromiseStatus status={promises.sync} />
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
