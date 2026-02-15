import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const FilterNothing = () => {
    const updateConversationsSorting = useAppStore(
        (state) => state.updateConversationsSorting,
    );

    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    <u>Nothing</u> found after filter
                </>
            }
            description={
                <>The filter you applied has resulted in no conversations</>
            }
        >
            <Button
                className="w-full not-hover:bg-bg-1!"
                onClick={() => updateConversationsSorting({ filter: "" })}
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
