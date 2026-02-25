import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    type?: "conversations" | "notes" | "messages";
    onClear?: () => void;
};

export const FilterNothing = ({ type, onClear }: Props) => {
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    return (
        <AbsentData
            title={
                <>
                    <u>Nothing</u> found after filter
                </>
            }
            description={<>The filter you applied has resulted in no data</>}
        >
            <Button
                className="w-full not-hover:bg-bg-1!"
                onClick={() => {
                    if (type) {
                        updateDisplay({ [type]: { filter: "" } });
                    } else if (onClear) {
                        onClear();
                    }
                }}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/delete.svg"
                />
                Clear
            </Button>
        </AbsentData>
    );
};
