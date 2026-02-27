import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

type Props = {
    onNavigate: () => void;
};

export const NoInvitations = ({ onNavigate }: Props) => {
    return (
        <AbsentData
            title={
                <>
                    No invitations to <u>this</u> conversation
                </>
            }
            description={
                <>
                    Although there are no available invitations to this
                    conversaiton, you can <mark>create</mark> one!
                </>
            }
        >
            <Button
                className="w-full max-w-48"
                onClick={onNavigate}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cubeadd.svg"
                />
                Create
            </Button>
        </AbsentData>
    );
};
