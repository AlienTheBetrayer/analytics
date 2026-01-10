import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const Topline = () => {
    // zustand
    const pushNotification = useAppStore((state) => state.pushNotification);

    return (
        <div className="box p-0! gap-1! flex-row! transition-all duration-300 h-10 min-h-10 items-center">
            <div className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/emulate.svg"
                />
                <span>Synthetic events</span>
            </div>

            <Tooltip
                className="ml-auto"
                direction="top"
                text="Generate a random notification"
            >
                <Button
                    className="p-0!"
                    onClick={() => {
                        pushNotification({
                            status: "error",
                            type: "account",
                            description: "",
                            title: "zyablik",
                        });
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/random.svg"
                    />
                </Button>
            </Tooltip>
        </div>
    );
};
