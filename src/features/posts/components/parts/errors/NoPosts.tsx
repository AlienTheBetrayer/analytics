import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoPosts = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Absent</u> posts
                </>
            }
            description={
                <>
                    The user you are currently viewng has <u>not</u> yet created
                    a single post, you can try hitting this user up in hopes
                    that they might <mark>create</mark> a post!
                </>
            }
        >
            <Tooltip
                text="To home"
                className="w-full"
            >
                <LinkButton href="/home">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/back.svg"
                    />
                    Go home
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
