import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Deselect = () => {
    // zustand
    const selectProject = useAppStore((state) => state.selectProject);

    return (
        <Tooltip
            text="De-select the project"
            direction="top"
        >
            <Button
                className="text-6! p-0!"
                onClick={() => {
                    selectProject(undefined);
                }}
            >
                <Image
                    alt="go back"
                    src="/back.svg"
                    width={16}
                    height={16}
                />
            </Button>
        </Tooltip>
    );
};
