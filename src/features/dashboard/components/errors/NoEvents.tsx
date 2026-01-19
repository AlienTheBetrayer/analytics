import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const NoEvents = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/type.svg"
                        />
                    </div>

                    <span className="text-5!">
                        <u>Absent</u> events
                    </span>

                    <p className="max-w-100 text-center">
                        The project you selected does <u>not</u> have any events
                        yet. You can try sending them from the{" "}
                        <mark>emulation</mark> page or wait for the analytics
                        data to be <b>gathered</b>.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
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
                            {promiseStatus(promises.noEventsRefetch)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/server.svg"
                            />
                            Re-fetch
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
