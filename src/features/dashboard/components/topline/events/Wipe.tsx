import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";

export const Wipe = () => {
    // zustand
    const deleteData = useAppStore((state) => state.deleteData);
    const events = useAppStore((state) => state.events);
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = useMessageBox();

    return (
        <>
            {deleteEventsBox.render({
                children:
                    "You will delete every single event and their related data in this project!",
                onSelect: (res) => {
                    if (!selectedProjectId) {
                        return;
                    }

                    if (res === "yes") {
                        deleteData({
                            id: events[selectedProjectId]?.map((e) => e.id),
                            type: "event",
                            promiseKey: `eventsDeleteTopline`,
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
                    <PromiseStatus status={promises.eventsDeleteTopline} />
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
