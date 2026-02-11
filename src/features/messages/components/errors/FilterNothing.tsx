import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

type Props = {
    onClear: () => void;
};

export const FilterNothing = ({ onClear }: Props) => {
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
                onClick={onClear}
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
