import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useState } from "react";

export const Wipe = () => {
    // zustand
    const deleteData = useAppStore((state) => state.deleteData);
    const events = useAppStore((state) => state.events);
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const [boxVisibility, setBoxVisibility] = useState<{
        events: boolean;
    }>({ events: false });

    return (
        <>
            <MessageBox
                visibility={boxVisibility.events}
                onSelect={(res) => {
                    setBoxVisibility((prev) => ({ ...prev, events: false }));
                    
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
                }}
            >
                You will delete every single event and their related data in
                this project!
            </MessageBox>

            <Tooltip text="Wipe all events">
                <Button
                    className="text-6!"
                    onClick={() => {
                        setBoxVisibility((prev) => ({
                            ...prev,
                            events: true,
                        }));
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
