import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

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
                if (res === "yes") {
                    if (!selectedProjectId) {
                        return;
                    }

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
            <Tooltip
                className="ml-auto"
                text="Wipe all events"
                direction="top"
            >
                <Button
                    className="text-6! p-0!"
                    onClick={() => {
                        deleteEventsBox.show();
                    }}
                >
                    {promiseStatus(promises.eventsDeleteTopline)}
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
