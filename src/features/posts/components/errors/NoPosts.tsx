import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { user: User; profile: Profile };
};

export const NoPosts = ({ data }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const getPosts = useAppStore((state) => state.getPosts);

    return (
        <div className="flex flex-col items-center justify-center mt-8">
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
                        <u>No</u> posts
                    </span>

                    <p className="max-w-100 text-center">
                        This user has yet to <mark>embark</mark> on a post
                        creation journey, you can message this user, tell them
                        what they are missing out on, and you will see their
                        posts <mark>here</mark> once they publish any
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Attempt a re-fetch"
                        className="w-full"
                    >
                        <Button
                            className="w-full"
                            onClick={() => {
                                getPosts({
                                    type: "all",
                                    username: data.user.username,
                                    promiseKey: "getPostsRefetch",
                                    caching: false,
                                });
                            }}
                        >
                            <PromiseStatus status={promises.getPostsRefetch} />
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/server.svg"
                            />
                            Re-fetch
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
