import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";

export const AlreadySent = () => {
    return (
        <AbsentData
            className="mt-0!"
            title={
                <>
                    <mark>Successfully</mark> sent!
                </>
            }
            description={
                <>
                    You have just sent a message and we will <u>review</u> it as
                    fast as we can. Thanks!
                </>
            }
        >
            <Tooltip
                text="All sent messages"
                className="w-full max-w-48"
            >
                <LinkButton href="/contact/list">
                    <Image
                        alt="list"
                        width={16}
                        height={16}
                        src="/cubes.svg"
                    />
                    List
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
