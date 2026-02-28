import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const DisplayFormat = () => {
    // zustand
    const display = useLocalStore((state) => state.display);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);

    // media
    const isMobile = useMediaQuery("(max-width:640px)");

    return (
        <div className="box w-full p-4! gap-4! acrylic">
            <div className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubes.svg"
                />
                <span>Columns per row</span>
            </div>

            <hr />

            <ul className="grid grid-cols-2 gap-2">
                {Array.from({ length: isMobile ? 2 : 4 }, (_, k) => (
                    <li
                        key={k}
                        className="flex flex-col gap-1"
                    >
                        <Checkbox
                            value={display.view.postsColumns === String(k + 1)}
                            onToggle={() => {
                                updateDisplay({
                                    view: {
                                        postsColumns: String(
                                            k + 1,
                                        ) as typeof display.view.postsColumns,
                                    },
                                });
                            }}
                        >
                            <span>{k + 1}</span>
                        </Checkbox>

                        <Button
                            className="rounded-md!"
                            onClick={() => {
                                updateDisplay({
                                    view: {
                                        postsColumns: String(
                                            k + 1,
                                        ) as typeof display.view.postsColumns,
                                    },
                                });
                            }}
                        >
                            <ul className="flex flex-col gap-1 w-full">
                                {Array.from({ length: 3 }, (_, i) => (
                                    <li
                                        key={`${k}${i}`}
                                        className="w-full flex gap-1"
                                    >
                                        {Array.from(
                                            { length: k + 1 },
                                            (_, g) => (
                                                <div
                                                    className="w-full h-6 rounded-md! box p-0! outline-1 outline-bg-3
                                            hover:outline-blue-2 transition-all duration-400"
                                                    key={`${k}${g}${i}`}
                                                />
                                            ),
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
