import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const EditingTopline = () => {
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    return (
        <ul className="box h-10! p-0! flex-row! items-center!">
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/pencil.svg"
                />
            </li>

            <li>
                <Button
                    onClick={() => {
                        updateDisplay({ messages: { tab: "messages" } });
                    }}
                >
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/back.svg"
                    />
                </Button>
            </li>
        </ul>
    );
};
