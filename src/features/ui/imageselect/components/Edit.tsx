import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

type Props = {
    file?: File | null;
    onDelete: () => void;
    onEdit: () => void;
};

export const Edit = ({ file, onDelete, onEdit }: Props) => {
    const image = file && URL.createObjectURL(file);

    return (
        <ul className="relative box py-0! px-2! w-full overflow-hidden border-0! aspect-video group duration-500!">
            {image && (
                <li>
                    <Image
                        alt=""
                        src={image}
                        fill
                        style={{ objectFit: "cover" }}
                        className="invert-0! group-hover:scale-130 group-focus-within:scale-130 duration-1000!"
                    />
                </li>
            )}

            <li>
                <ul className="flex gap-1 justify-end">
                    <li>
                        <Tooltip
                            direction="top"
                            text="Re-select"
                        >
                            <Button
                                onClick={onEdit}
                                className="backdrop-blur-xs!"
                            >
                                <Image
                                    alt="edit"
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip
                            direction="top"
                            text="Delete"
                        >
                            <Button
                                onClick={onDelete}
                                className="backdrop-blur-xs!"
                            >
                                <Image
                                    alt="del"
                                    width={16}
                                    height={16}
                                    src="/delete.svg"
                                />
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
