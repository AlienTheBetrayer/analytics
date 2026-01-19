import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { ProjectManipulation } from "../../projects/ProjectManipulation";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";

export const Manipulation = () => {
    return (
        <Tooltip text="Advanced editing">
            <Modal
                direction="bottom-left"
                element={() => <ProjectManipulation />}
            >
                <Button className="text-6! p-0!">
                    <Image
                        alt="manipulation"
                        src="/settings.svg"
                        width={16}
                        height={16}
                    />
                </Button>
            </Modal>
        </Tooltip>
    );
};
