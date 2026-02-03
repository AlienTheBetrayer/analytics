import Image from "next/image";
import { ProfileDisplay } from "../../../ProfileDisplay";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Outcoming = ({ data }: Props) => {
    // fetching
    const { data: requests_outcoming, isLoading } = useQuery({
        key: ["requests_outcoming", data.id],
    });

    return (
        <div className="flex flex-col gap-2 grow">
            {/* outcoming requests topline */}
            <span className="flex gap-2 items-center whitespace-nowrap">
                <Tooltip
                    text="Re-load friend requests"
                    direction="top"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("outcomingReload", async () => {
                                return queryInvalidate({
                                    key: ["requests_outcoming", data.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="outcomingReload" />

                        <Image
                            src="/reload.svg"
                            width={14}
                            height={14}
                            alt="refresh"
                        />
                    </Button>
                </Tooltip>

                <hr className="w-px! h-1/3 bg-background-a-10" />

                <span>Outcoming requests</span>

                <small className="ml-auto text-ellipsis-left">
                    (you sent these)
                </small>
            </span>

            {/* outcoming requests */}
            {isLoading ? (
                <ul className="flex flex-col gap-2">
                    {Array.from({ length: 4 }, (_, k) => (
                        <li
                            key={k}
                            className="w-full loading h-10"
                        ></li>
                    ))}
                </ul>
            ) : (
                <ul
                    className="flex flex-col gap-2 overflow-y-auto max-h-128 scheme-dark"
                    style={{ scrollbarWidth: "thin" }}
                >
                    {requests_outcoming?.map((id) => (
                        <li key={id}>
                            <ProfileDisplay id={id} />
                        </li>
                    ))}
                </ul>
            )}

            <hr className="mt-auto" />
        </div>
    );
};
