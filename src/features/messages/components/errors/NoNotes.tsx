import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";

export const NoNotes = () => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    No notes <u>yet</u>
                </>
            }
            description={
                <>
                    Create your own notes with <mark>checklists</mark> so you
                    always remember everything!
                </>
            }
        >
            <Button className="w-full max-w-64">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
                Create
            </Button>
        </AbsentData>
    );
};
