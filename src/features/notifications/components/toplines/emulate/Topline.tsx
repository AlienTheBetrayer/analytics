import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import {
    DashboardNotificationTab,
    DashboardNotificationType,
} from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";
import { lorem } from "txtgen";

export const Topline = () => {
    // zustand
    const pushNotification = useLocalStore((state) => state.pushNotification);

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
                direction="top"
                text="Generate a random notification"
            >
                <Button
                    className="p-0!"
                    onClick={() => {
                        const statuses = ["Error", "Warning", "Information"];
                        const types = ["Account", "Dashboard"];

                        pushNotification({
                            status: statuses[
                                Math.round(Math.random() * 2)
                            ] as DashboardNotificationType,
                            type: types[
                                Math.round(Math.random())
                            ] as DashboardNotificationTab,
                            description: lorem(3, 5),
                            title: lorem(1, 1),
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
