import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";

export const Emulate = () => {
    // zustand
    const pushNotification = useAppStore((state) => state.pushNotification);

    return (
        <div className="flex">
            <Button
                onClick={() => {
                    pushNotification({ status: "error", type: "account" });
                }}
            >
                Push
            </Button>
        </div>
    );
};
