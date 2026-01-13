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
            <Tooltip
                text="Wipe this project"
                direction="top"
            >
                <Button
                    className="text-6! p-0!"
                    onClick={() => {
                        deleteProjectBox.show();
                    }}
                >
                    {promiseStatus(promises.projectsDeleteTopline)}
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
