import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";

export const NoMessages = () => {
    return (
        <AbsentData
            title={
                <>
                    Messages are <u>absent</u>
                </>
            }
            description={
                <>
                    You have not sent a <u>single</u> message yet and there are
                    no visible messages in the database
                </>
            }
        >
            <Tooltip
                text="Send a message"
                className="w-full max-w-48"
            >
                <LinkButton href="/contact/send">
                    <Image
                        alt="list"
                        width={16}
                        height={16}
                        src="/send.svg"
                    />
                    Send
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
