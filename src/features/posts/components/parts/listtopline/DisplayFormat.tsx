import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { ViewPostColumns } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    hide: () => void;
};

export const DisplayFormat = ({ hide }: Props) => {
    // zustand
    const display = useLocalStore((state) => state.display);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);

    return (
        <div className="box w-screen max-w-96 p-3!">
            <CloseButton hide={hide} />

            <div className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubes.svg"
                />
                <span>Columns per row</span>
            </div>

            <ul className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }, (_, k) => (
                    <li
                        key={k}
                        className="flex flex-col gap-4"
                    >
                        <Checkbox
                            value={display.view.postsColumns === String(k + 1)}
                            onToggle={() => {
                                updateDisplay({
                                    view: {
                                        postsColumns: String(
                                            k + 1,
                                        ) as ViewPostColumns,
                                    },
                                });
                            }}
                        >
                            <span>{k + 1}</span>
                        </Checkbox>

                        <ul className="flex flex-col gap-1">
                            {Array.from({ length: 3 }, (_, i) => (
                                <li
                                    key={`${k}${i}`}
                                    className="w-full flex gap-1"
                                >
                                    {Array.from({ length: k + 1 }, (_, g) => (
                                        <div
                                            className="w-full h-6 rounded-md! box p-0! outline-1 outline-background-a-8 
                                            hover:outline-blue-2 transition-all duration-400"
                                            key={`${k}${g}${i}`}
                                        />
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
