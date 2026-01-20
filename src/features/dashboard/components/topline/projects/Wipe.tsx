import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";

export const Wipe = () => {
    // zustand
    const deleteData = useAppStore((state) => state.deleteData);
    const promises = useAppStore((state) => state.promises);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // messageboxes
    const deleteProjectsBox = useMessageBox();

    return (
        <>
            {deleteProjectsBox.render({
                children:
                    "You will delete every single data entry about this project, including events!",
                onSelect: (res) => {
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
                },
            })}

            <Tooltip text="Wipe this project">
                <Button
                    className="text-6! p-0!"
                    onClick={() => {
                        deleteProjectsBox.show();
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
