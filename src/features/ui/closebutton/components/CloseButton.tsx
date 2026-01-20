import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type Props = {
    hide: () => void;
} & ComponentPropsWithoutRef<"button">;

export const CloseButton = ({ hide }: Props) => {
    return (
        <Button
            aria-label="close"
            className="absolute right-4 top-2 min-w-6! min-h-6! w-6! h-6! p-0!"
            onClick={() => {
                hide();
            }}
        >
            <Image
                alt=""
                width={14}
                height={14}
                src="/cross.svg"
            />
        </Button>
    );
};
