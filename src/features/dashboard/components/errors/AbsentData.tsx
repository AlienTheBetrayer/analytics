import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

export const AbsentData = () => {
    // zustand
    const promises = useAppStore((state) => state.promises);
    const sync = useAppStore((state) => state.sync);

    return (
        <div className="flex flex-col items-center justify-center mt-30">
            <div className="flex flex-col gap-8 items-center">
                <div className="flex flex-col gap-2 items-center">
                    {promiseStatus(promises.sync)}

                    <div className="relative flex gap-1">
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/privacy.svg"
                        />
                    </div>

                    <span className="text-5!">
                        <u>Absent</u> data
                    </span>

                    <p className="max-w-100 text-center">
                        Currently there is no data stored in the database. You
                        can try <b>re-fetching</b> to ensure the availability of
                        the <mark>data</mark> at the moment.
                    </p>
                </div>

                <hr />
                <div className="flex flex-col gap-2 items-center w-full">
                    <Tooltip
                        text="Re-sync data"
                        className="w-full"
                    >
                        <Button
                            className="w-full"
                            onClick={() => {
                                sync({ promiseKey: "syncNoData" });
                            }}
                        >
                            {promiseStatus(promises.syncNoData)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/server.svg"
                            />
                            Fetch attempt
                        </Button>
                    </Tooltip>

                    <Tooltip
                        text="Emulate synthetic events"
                        className="w-full"
                    >
                        <LinkButton href="/emulate">
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/pencil.svg"
                            />
                            Synthesize events
                        </LinkButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
