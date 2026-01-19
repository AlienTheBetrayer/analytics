import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const EmptyQuery = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-32">
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
                        <u>Invalid</u> query
                    </span>

                    <p className="max-w-100 text-center">
                        The query you have prompted is <u>invalid</u>, prompt a{" "}
                        <mark>valid</mark> query, afterwards you might see the
                        user you may have been looking for
                    </p>
                </div>

                <hr />

                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Go back home"
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
                            Home
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
