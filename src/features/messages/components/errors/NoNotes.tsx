import { CreateBoard } from "@/features/messages/components/noteboard/CreateBoard";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
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
            <Modal
                className="w-full max-w-64"
                element={() => <CreateBoard />}
                direction="top"
            >
                <Button className="w-full">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/imageadd.svg"
                    />
                    Create
                </Button>
            </Modal>
        </AbsentData>
    );
};
