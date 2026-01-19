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
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // messageboxes
    const deleteProjectBox = usePopup(({ hide }) => (
        <MessageBox
            description="You will delete every single data entry about this project, including events!"
            onInteract={(res) => {
                hide();
                if (!selectedProjectId) {
                    return;
                }

                if (res === "yes") {
                    deleteData({
                        id: [selectedProjectId],
                        type: "project",
                        promiseKey: `projectsDeleteTopline`,
                    });
                }
            }}
        />
    ));

    return (
        <>
            {deleteProjectBox.render()}
            <Tooltip text="Wipe this project">
                <Button
                    className="text-6! p-0!"
                    onClick={() => {
                        deleteProjectBox.show();
                    }}
                >
                    <PromiseStatus status={promises.projectsDeleteTopline} />
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
