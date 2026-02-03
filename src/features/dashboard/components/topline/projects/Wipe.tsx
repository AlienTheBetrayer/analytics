import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { wrapPromise } from "@/promises/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { dashboardDeleteProject } from "@/query-api/calls/dashboard";

export const Wipe = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    // message boxes
    const deleteProjectsBox = useMessageBox();

    // fetching
    const { data } = useQuery({ key: ["projects"] });

    return (
        <>
            {deleteProjectsBox.render({
                children:
                    "You will delete every single data entry about this project, including events!",
                onSelect: (res) => {
                    if (!selectedProjectId || !data?.[selectedProjectId]) {
                        return;
                    }

                    if (res === "yes") {
                        wrapPromise("deleteProject", () => {
                            return dashboardDeleteProject({
                                project: data[selectedProjectId],
                            });
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
                    <PromiseState state="deleteProject" />
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
