import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

export const DisplayFormat = () => {
    const display = useLocalStore((state) => state.display);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);

    return (
        <div className="box items-stretch! w-screen max-w-lg p-4! gap-4! acrylic">
            <span className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubes.svg"
                />
                Notes format
            </span>

            <hr />

            <ul className="grid grid-cols-2 gap-2">
                <li className="flex flex-col gap-1 items-center">
                    <Checkbox
                        value={display?.messages?.noteboard?.view === "compact"}
                        onToggle={() =>
                            updateDisplay({
                                messages: { noteboard: { view: "compact" } },
                            })
                        }
                    >
                        Compact
                    </Checkbox>
                    <Button
                        className="flex-col! w-full rounded-md! h-full items-center!"
                        onClick={() => {
                            updateDisplay({
                                messages: { noteboard: { view: "compact" } },
                            });
                        }}
                    >
                        <div className="w-full h-4 loading" />
                        <div className="w-full h-4 loading" />
                        <div className="w-full h-4 loading" />
                    </Button>
                </li>

                <li className="flex flex-col gap-1 items-center">
                    <Checkbox
                        value={
                            display?.messages?.noteboard?.view === "expanded"
                        }
                        onToggle={() =>
                            updateDisplay({
                                messages: { noteboard: { view: "expanded" } },
                            })
                        }
                    >
                        Expanded
                    </Checkbox>
                    <Button
                        className="grid! grid-cols-4 gap-2! w-full rounded-md! h-full items-center!"
                        onClick={() => {
                            updateDisplay({
                                messages: { noteboard: { view: "expanded" } },
                            });
                        }}
                    >
                        {Array.from({ length: 4 }, (_, k) => (
                            <div
                                className="box flex-col! p-2! rounded-md! loading aspect-square"
                                key={k}
                            >
                                {Array.from({ length: 2 }, (_, k) => (
                                    <div
                                        className="w-full h-8 loading"
                                        key={k}
                                    />
                                ))}
                            </div>
                        ))}
                    </Button>
                </li>
            </ul>
        </div>
    );
};
