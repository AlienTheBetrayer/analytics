import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

type Props = {
    data: Post;
};

export const NoContent = ({ data }: Props) => {
    // zustand
    const users = useAppStore((state) => state.users);

    return (
        <AbsentData
            title={
                <>
                    <u>Absent</u> content
                </>
            }
            description={
                <>
                    The post you are currently on does not have{" "}
                    <u>any content</u> in it, the <b>author</b> decided that it
                    would be great for it to be <u>empty</u>.
                </>
            }
        >
            <Tooltip
                text="To posts"
                className="w-full"
            >
                <LinkButton href={`/posts/${users[data.user_id]?.username}`}>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/back.svg"
                    />
                    Go back
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
