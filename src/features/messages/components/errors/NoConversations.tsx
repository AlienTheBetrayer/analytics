import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

type Props = {
    username?: string;
};

export const NoConversations = ({ username }: Props) => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    Conversations are <u>absent</u>
                </>
            }
            description={
                <>
                    Currently you <u>haven&apos;t</u> spoken to anyone yet, hit
                    them up!
                </>
            }
        >
            {username && (
                <LinkButton
                    href={`/profile/${username}/friends`}
                    className="w-full"
                >
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
                    Friends
                </LinkButton>
            )}
        </AbsentData>
    );
};
