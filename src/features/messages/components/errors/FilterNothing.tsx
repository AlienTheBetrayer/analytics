import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    type: "conversations" | "notes";
};

export const FilterNothing = ({ type }: Props) => {
    const updateConversationsSorting = useAppStore(
        (state) => state.updateConversationsSorting,
    );
    const updateNotesSorting = useAppStore((state) => state.updateNotesSorting);

    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    <u>Nothing</u> found after filter
                </>
            }
            description={<>The filter you applied has resulted in no data</>}
        >
            <Button
                className="w-full not-hover:bg-bg-1!"
                onClick={() =>
                    type === "conversations"
                        ? updateConversationsSorting({ filter: "" })
                        : updateNotesSorting({ filter: "" })
                }
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
