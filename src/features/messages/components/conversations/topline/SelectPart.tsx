import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    hr?: boolean;
};

export const SelectPart = ({ hr }: Props) => {
    const selectDisplay = useAppStore((state) => state.selectDisplay);

    return (
        <>
            {(hr ?? true) && <hr className="mx-1 w-px! h-4! border-bg-5!" />}

            {(() => {
                switch (selectDisplay) {
                    case "url":
                    case "fetch": {
                        return (
                            <Tooltip
                                direction="bottom"
                                text="In a conversation"
                            >
                                <span className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/cube.svg"
                                    />
                                </span>
                            </Tooltip>
                        );
                    }
                    case "notselected": {
                        return (
                            <Tooltip
                                direction="bottom"
                                text="No chat selected"
                            >
                                <span className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={12}
                                        height={12}
                                        src="/select.svg"
                                    />
                                </span>
                            </Tooltip>
                        );
                    }
                    case "wrong": {
                        return (
                            <Tooltip
                                direction="bottom"
                                text="Invalid URL"
                            >
                                <span className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/delete.svg"
                                    />
                                </span>
                            </Tooltip>
                        );
                    }
                    case "noteboard": {
                        return (
                            <Tooltip
                                direction="bottom"
                                text="Subsection of notes"
                            >
                                <span className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/pencil.svg"
                                    />
                                </span>
                            </Tooltip>
                        );
                    }
                }
            })()}
        </>
    );
};
