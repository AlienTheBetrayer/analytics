import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { dashboardDeleteEvents } from "@/query-api/calls/dashboard";
import { useQuery } from "@/query/core";

export const Wipe = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = useMessageBox();

    // fetching
    const { data } = useQuery({ key: ["projects"] });

    return (
        <>
            {deleteEventsBox.render({
                children:
                    "You will delete every single event and their related data in this project!",
                onSelect: async (res) => {
                    if (!selectedProjectId || !data?.[selectedProjectId]) {
                        return;
                    }

                    if (res === "yes") {
                        wrapPromise("deleteEvents", () => {
                            return dashboardDeleteEvents({
                                project: data[selectedProjectId],
                            });
                        });
                    }
                },
            })}

            <Tooltip text="Wipe all events">
                <Button
                    className="text-6!"
                    onClick={() => {
                        deleteEventsBox.show();
                    }}
                >
                    <PromiseState state="deleteEvents" />
                    <Image
                        alt="delete"
                        src="/delete.svg"
                        width={16}
                        height={16}
                    />
                </Button>
            </Tooltip>
        </>
    );
};
