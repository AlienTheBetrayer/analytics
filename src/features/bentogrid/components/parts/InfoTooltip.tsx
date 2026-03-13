import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";

type Props = {
    text: string;
    color: string;
    src: string;
    children: string;
};

export const InfoTooltip = ({ text, color, src, children }: Props) => {
    return (
        <Tooltip
            tooltipClassname="whitespace-normal! max-w-81"
            clickHides={false}
            direction="top"
            text={children}
            className="w-full"
        >
            <Button className="flex-col w-full aspect-square not-hover:bg-bg-1! gap-0! rounded-4xl!">
                <span className="flex items-center">
                    <div
                        className="w-1 h-1 rounded-full"
                        style={{ background: color }}
                    />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src={src}
                    />
                </span>
                {text}
            </Button>
        </Tooltip>
    );
};
