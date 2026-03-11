/** @format */

import { CreateConversation } from "@/features/messages/components/conversations/create/CreateConversation";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import Image from "next/image";

export const NoConversations = () => {
    return (
        <AbsentData
            title={
                <>
                    Conversations are <u>absent</u>
                </>
            }
            description={
                <>
                    Currently you <u>haven&apos;t</u> spoken to anyone yet, hit them up!
                </>
            }
        >
            <Modal
                element={() => <CreateConversation />}
                direction="top"
                tooltipClassName="w-screen max-w-64"
                className="w-full max-w-48"
            >
                <Button className="w-full">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/launch.svg"
                    />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/friends.svg"
                    />
                    Create
                </Button>
            </Modal>
        </AbsentData>
    );
};
