import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: Post;
};

export const NoContent = ({ data }: Props) => {
    // zustand
    const users = useAppStore((state) => state.users);

    return (
        <div className="flex flex-col items-center justify-center m-auto">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/type.svg"
                        />
                    </div>

                    <span className="text-5!">
                        <u>Absent</u> content
                    </span>

                    <p className="max-w-100 text-center">
                        The post you are currently on does not have any contents
                        in it, the author decided that it would be great for it
                        to have nothing
                    </p>
                </div>

                <hr />

                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="To posts"
                        className="w-full"
                    >
                        <LinkButton
                            href={`/posts/${users[data.user_id]?.username}`}
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                            Go back
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
