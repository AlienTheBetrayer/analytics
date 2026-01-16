import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Deselect = () => {
    // zustand
    const selectProject = useAppStore((state) => state.selectProject);

    return (
        <Tooltip text="De-select the project">
            <Button
                className="text-6! p-0!"
                onClick={() => {
                    selectProject(undefined);
                }}
            >
                <Image
                    alt="deselect"
                    src="/select.svg"
                    width={14}
                    height={14}
                />
            </Button>
        </Tooltip>
    );
};
