import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoProjectSelected = () => {
    // zustand
    const projects = useAppStore((state) => state.projects);
    const selectProject = useAppStore((state) => state.selectProject);

    return (
        <AbsentData
            title={
                <>
                    <u>No project</u> is selected
                </>
            }
            description={
                <>
                    You did not select a project, hence the <b>events</b> tab is
                    empty. Select a project manually or try out the{" "}
                    <mark>random tool</mark> to flip the project.
                </>
            }
        >
            <Tooltip
                text="Select a random project"
                className="w-full"
            >
                <Button
                    className="w-full"
                    onClick={() => {
                        const ids = Object.keys(projects);

                        if (!ids.length) {
                            return;
                        }

                        selectProject(
                            ids[Math.floor(Math.random() * ids.length)],
                        );
                    }}
                >
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/random.svg"
                    />
                    Random select
                </Button>
            </Tooltip>
        </AbsentData>
    );
};
