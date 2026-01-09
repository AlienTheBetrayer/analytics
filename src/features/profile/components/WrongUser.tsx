import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const WrongUser = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);

    return (
        <div className="flex flex-col items-center justify-center my-auto">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        {promises.getUsers === "pending" ? (
                            <Spinner styles="big" />
                        ) : (
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/book.svg"
                            />
                        )}
                    </div>

                    <span className="text-5! text-foreground-5!">
                        User <u>not found</u>
                    </span>

                    <p className="max-w-100 text-center">
                        We could <u>not</u> find this user nor their profile.
                        Make sure the username you are searching for is the{" "}
                        <b>correct</b>. one.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Return to the front page"
                        className="w-full"
                    >
                        <LinkButton
                            className="w-full"
                            href="/home"
                        >
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/cube.svg"
                            />
                            Go back home
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
