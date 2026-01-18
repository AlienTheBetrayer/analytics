import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const NoPosts = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

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
                        This user currently has yet to <mark>embark</mark> on a
                        post creation journey, you can message this user, tell
                        them what they are missing out on
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
                                sync({
                                    promiseKey: "getPostsRefetch",
                                    caching: false,
                                });
                            }}
                        >
                            {promiseStatus(promises.getPostsRefetch)}
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
