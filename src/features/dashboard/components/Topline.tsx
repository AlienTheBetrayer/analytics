import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Button } from "../../ui/button/components/Button";
import { promiseStatus } from "@/utils/status";

export const Topline = () => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const data = useAppStore((state) => state.data);

    // zustand functions
    const syncData = useAppStore((state) => state.syncData);

    return (
        <nav className="flex flex-col items-center gap-2">
            <div className="flex w-full gap-2">
                <Tooltip text="Emulate fake events" direction="top" className="w-full">
                    <LinkButton href="/dashboard/emulate/" className="w-full">
                        <Image width={16} height={16} alt="emulate" src="/emulate.svg" />
                        <span>Emulate events</span>
                    </LinkButton>
                </Tooltip>
            </div>
            <hr />
            <div className="flex gap-1 w-full items-center">
                <Image src="/server.svg" alt="" width={16} height={16} />
                <span>Client</span>
            </div>

            <div className="flex gap-2 w-full">
                <span className="flex gap-1 items-center">
                    <div
                        className={`rounded-full w-1.5 h-1.5 ${data ? "bg-[rgb(56,66,255)]" : "bg-red-500"} duration-1000`}
                    />
                    {data ? "Synced" : "Syncing..."}
                </span>

                <Tooltip text="Re-sync all data" className="ml-auto" disabledPointer>
                    <Button
                        onClick={() => {
                            syncData();
                        }}
                    >
                        {promiseStatus(promises.sync)}
                        <Image src="/download.svg" alt="" width={16} height={16} />
                        <mark>Sync</mark>
                    </Button>
                </Tooltip>
            </div>
        </nav>
    );
};
