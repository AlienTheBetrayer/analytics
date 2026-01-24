import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import {
    NotificationStatus,
    NotificationTab,
} from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { lorem } from "txtgen";

export const Topline = () => {
    // zustand
    const pushNotification = useAppStore((state) => state.pushNotification);

    return (
        <ul className="box p-0! gap-1! flex-row! sticky! top-4 z-2 transition-all duration-300 h-10 min-h-10 items-center">
            <li className="absolute flex gap-1 items-center left-1/2 top-1/2 -translate-1/2 transition-all duration-500">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/emulate.svg"
                />
                <span>Synthetic events</span>
            </li>

            <li className="ml-auto!">
                <Tooltip text="Generate a random notification">
                    <Button
                        className="p-0!"
                        onClick={() => {
                            const statuses = [
                                "Error",
                                "Warning",
                                "Information",
                            ];
                            const tabs = ["Account", "Dashboard"];

                            pushNotification({
                                status: statuses[
                                    Math.round(Math.random() * 2)
                                ] as NotificationStatus,
                                tab: tabs[
                                    Math.round(Math.random())
                                ] as NotificationTab,
                                description: lorem(3, 5),
                                title: lorem(1, 1),
                                type: "Emulated",
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
            </li>
        </ul>
    );
};
