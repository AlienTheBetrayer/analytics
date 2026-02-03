import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { queryInvalidate } from "@/query/auxiliary";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";

export const NoEvents = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

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
                    to be <b>gathered</b>. This can also appear after filtering.
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
                        if (selectedProjectId) {
                            wrapPromise("syncEvents", async () => {
                                return queryInvalidate({
                                    key: ["events", selectedProjectId],
                                });
                            });
                        }
                    }}
                >
                    <PromiseState state="syncEvents" />
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
