import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Emulate = () => {
    // zustand
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);

    return (
        <Tooltip text="Emulate events for this project">
            <LinkButton
                className="text-6! p-0!"
                href={`/emulate/${selectedProjectId}`}
            >
                <Image
                    alt="manipulation"
                    src="/emulate.svg"
                    width={16}
                    height={16}
                />
            </LinkButton>
        </Tooltip>
    );
};
