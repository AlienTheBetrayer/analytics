import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import { useLocalStore } from "@/zustand/localStore";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";

export const Topline = () => {
    // local storage
    const resetPreferences = useLocalStore((state) => state.resetPreferences);

    // message boxes
    const preferencesBox = useMessageBox();

    return (
        <ul className="box p-0! gap-1! flex-row! sticky! top-4 z-2 transition-all duration-300 h-10 min-h-10 items-center">
            {preferencesBox.render({
                children:
                    "Factory resetting will drop all the changes you had already made to the preferences",
                onSelect: (res) => {
                    if (res === "yes") {
                        resetPreferences();
                    }
                },
            })}

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
                            preferencesBox.show();
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
