import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { Display } from "../Display";
import { Emulate } from "../Emulate";

export const Select = () => {
    // zustand
    const notifications = useAppStore((state) => state.notifications);

    // url
    const { tab } = useParams<{ tab?: string }>();

    switch (tab) {
        default:
        case "dashboard": {
            return <Display data={notifications.dashboard} />;
        }
        case "account": {
            return <Display data={notifications.account} />;
        }
        case "emulate": {
            return <Emulate />;
        }
    }
};
