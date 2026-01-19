import { MessageBox } from "@/features/ui/messagebox/components/MessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useState } from "react";
import { useLocalStore } from "@/zustand/localStore";

export const Topline = () => {
    // zustand
    const resetPreferences = useLocalStore(state => state.resetPreferences);

    // messageboxes
    const [boxVisibility, setBoxVisibility] = useState<{
        reset: boolean;
    }>({ reset: false });

    return (
        <ul className="box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center">
            <MessageBox
                visibility={boxVisibility.reset}
                onSelect={(res) => {
                    setBoxVisibility((prev) => ({ ...prev, reset: false }));
                    
                    if (res === "yes") {
                        resetPreferences();
                    }
                }}
            >
                Factory resetting will drop all the changes you had already made
                to the preferences
            </MessageBox>

            <li className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/settings.svg"
                />
                <span>Preferences</span>
            </li>

            <li className="ml-auto!">
                <Tooltip text="Factory-reset settings">
                    <Button
                        className="p-0!"
                        onClick={() => {
                            setBoxVisibility((prev) => ({
                                ...prev,
                                reset: true,
                            }));
                        }}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/delete.svg"
                        />
                    </Button>
                </Tooltip>
            </li>
        </ul>
    );
};
