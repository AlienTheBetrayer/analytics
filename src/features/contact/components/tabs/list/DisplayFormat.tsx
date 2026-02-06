import { Button } from "@/features/ui/button/components/Button";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    hide: () => void;
};

export const DisplayFormat = ({ hide }: Props) => {
    // local store
    const format = useLocalStore((state) => state.display.view.contactMessages);
    const updateDisplay = useLocalStore((state) => state.updateDisplay);

    return (
        <div className="box w-screen max-w-lg p-3!">
            <CloseButton hide={hide} />

            <span className="flex flex-col gap-1 items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubes.svg"
                />
                Messages format
            </span>

            <ul className="grid grid-flow-col auto-cols-fr gap-4">
                <li className="flex flex-col gap-1 items-center">
                    <Checkbox
                        value={format === "compact"}
                        onToggle={() =>
                            updateDisplay({
                                view: { contactMessages: "compact" },
                            })
                        }
                    >
                        Compact
                    </Checkbox>
                    <Button
                        className="w-full rounded-md! h-full items-center!"
                        onClick={() => {
                            updateDisplay({
                                view: { contactMessages: "compact" },
                            });
                        }}
                    >
                        <div className="w-full h-4 loading" />
                    </Button>
                </li>

                <li className="flex flex-col gap-1 items-center">
                    <Checkbox
                        value={format === "expanded"}
                        onToggle={() =>
                            updateDisplay({
                                view: { contactMessages: "expanded" },
                            })
                        }
                    >
                        Expanded
                    </Checkbox>
                    <Button
                        className="flex-col! w-full rounded-md! h-full! items-start!"
                        onClick={() => {
                            updateDisplay({
                                view: { contactMessages: "expanded" },
                            });
                        }}
                    >
                        <div className="w-full h-4 loading" />

                        <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 w-full items-center">
                            <div className="w-full aspect-square rounded-full! loading" />

                            <div className="flex flex-col gap-2">
                                <div className="h-4 loading" />
                                <div className="h-4 loading" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="h-4 loading" />
                                <div className="h-4 loading" />
                            </div>
                        </div>
                    </Button>
                </li>
            </ul>
        </div>
    );
};
