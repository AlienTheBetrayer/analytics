import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";

export const NoMessage = () => {
    return (
        <AbsentData
            title={
                <>
                    This message is <u>absent</u>
                </>
            }
            description={
                <>
                    The message you are currently viewing (its id) does not
                    exist yet, you can <mark>send</mark> a new one or view a
                    list of other messages
                </>
            }
        >
            <ul className="grid grid-cols-2 gap-4 w-full">
                <li>
                    <Tooltip
                        text="View other messages"
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
                </li>

                <li>
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
                </li>
            </ul>
        </AbsentData>
    );
};
