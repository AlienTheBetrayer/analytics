import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { usePopup } from "@/hooks/usePopup";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";

export const Wipe = () => {
    // zustand
    const deleteData = useAppStore((state) => state.deleteData);
    const events = useAppStore((state) => state.events);
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteEventsBox = usePopup(({ hide }) => (
        <MessageBox
            description="You will delete every single event and their related data in this project!"
            onInteract={(res) => {
                hide();
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
        />
    ));

    return (
        <>
            {deleteEventsBox.render()}
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
