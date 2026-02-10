import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { useQuery } from "@/query/core";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["post"]["data"];
};

export const NoContent = ({ data }: Props) => {
    // fetching
    const { data: user } = useQuery({ key: ["user", data.user_id] });

    return (
        <AbsentData
            className="mt-8"
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
                <LinkButton href={`/posts/${user?.username}`}>
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
