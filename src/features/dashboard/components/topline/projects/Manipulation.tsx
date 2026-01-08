import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { ProjectManipulation } from "../../projects/ProjectManipulation";

export const Manipulation = () => {
    return (
        <Tooltip
            text="Advanced editing"
            direction="top"
        >
            <Tooltip
                text="De-select the project"
                direction="bottom-left"
                element={<ProjectManipulation />}
                disabledPointer={false}
                type="modal"
            >
                <Button className="text-6! p-0!">
                    <Image
                        alt="manipulation"
                        src="/cube.svg"
                        width={16}
                        height={16}
                    />
                </Button>
            </Tooltip>
        </Tooltip>
    );
};
