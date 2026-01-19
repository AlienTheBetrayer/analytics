import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const NoProjectSelected = () => {
    // zustand
    const projects = useAppStore((state) => state.projects);
    const selectProject = useAppStore((state) => state.selectProject);

    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/link.svg"
                        />
                    </div>

                    <span className="text-5!">
                        <u>No project</u> is selected
                    </span>

                    <p className="max-w-100 text-center">
                        You did not select a project, hence the <b>events</b>{" "}
                        tab is empty. Select a project manually or try out the{" "}
                        <mark>random tool</mark> to flip the project.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
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
                </div>
            </div>
        </div>
    );
};
