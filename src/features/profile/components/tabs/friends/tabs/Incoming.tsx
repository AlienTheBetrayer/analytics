import Image from "next/image";
import { ProfileDisplay } from "../../../ProfileDisplay";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { queryInvalidate } from "@/query/auxiliary";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Incoming = ({ data }: Props) => {
    // fetching
    const { data: requests_incoming, isLoading } = useQuery({
        key: ["requests_incoming", data.id],
    });

    return (
        <div className="flex flex-col gap-2 grow">
            {/* incoming requests topline */}
            <span className="flex gap-2 items-center whitespace-nowrap">
                <Tooltip
                    text="Re-load friend requests"
                    direction="top"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("incomingReload", async () => {
                                return queryInvalidate({
                                    key: ["requests_incoming", data.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="incomingReload" />
                        <Image
                            src="/reload.svg"
                            width={14}
                            height={14}
                            alt="refresh"
                        />
                    </Button>
                </Tooltip>

                <hr className="w-px! h-1/3 bg-background-a-10" />

                <span>Incoming requests</span>

                <small className="ml-auto text-ellipsis-left">
                    (you received these)
                </small>
            </span>

            {/* incoming requests */}
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
                    {requests_incoming?.map((id) => (
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
