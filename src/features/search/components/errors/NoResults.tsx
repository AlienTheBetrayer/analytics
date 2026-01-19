import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    onSearch?: () => void;
};

export const NoResults = ({ onSearch }: Props) => {
    // zustand
    const promises = useAppStore((state) => state.promises);

    return (
        <div className="flex flex-col items-center justify-center mt-32">
            <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/prohibited.svg"
                        />
                    </div>

                    <span className="text-5!">
                        <u>No</u> users found
                    </span>

                    <p className="max-w-100 text-center">
                        The query you have prompted seems <mark>valid</mark>,
                        but we have <u>not</u>
                        found any users with it, try <b>changing</b> the query
                        to something else, either you messed up or the user
                        actually does not exist
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
                            onClick={onSearch}
                        >
                            {promiseStatus(promises.search)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/server.svg"
                            />
                            Re-fetch
                        </Button>
                    </Tooltip>

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
