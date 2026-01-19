import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { ProjectManipulation } from "../../projects/ProjectManipulation";

export const Manipulation = () => {
    return (
        <Tooltip text="Advanced editing">
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
                        src="/settings.svg"
                        width={16}
                        height={16}
                    />
                </Button>
            </Tooltip>
        </Tooltip>
    );
};
