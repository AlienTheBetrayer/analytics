import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoEvents = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

    return (
        <AbsentData
            title={
                <>
                    <u>Absent</u> events
                </>
            }
            description={
                <>
                    The project you selected does <u>not</u> have any events
                    yet. You can try sending them from the{" "}
                    <mark>emulation</mark> page or wait for the analytics data
                    to be <b>gathered</b>.
                </>
            }
        >
            <Tooltip
                text="Attempt a re-fetch"
                className="w-full"
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        sync({
                            promiseKey: "noEventsRefetch",
                            caching: false,
                        });
                    }}
                >
                    <PromiseStatus status={promises.noEventsRefetch} />
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/server.svg"
                    />
                    Re-fetch
                </Button>
            </Tooltip>
        </AbsentData>
    );
};
