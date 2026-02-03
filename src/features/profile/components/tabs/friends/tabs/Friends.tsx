import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ProfileDisplay } from "../../../ProfileDisplay";
import Image from "next/image";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { modifyFriendship } from "@/query-api/calls/users";
import { queryInvalidate } from "@/query/auxiliary";
import { wrapPromise } from "@/promises/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Friends = ({ data }: Props) => {
    // fetching
    const { data: friends, isLoading } = useQuery({
        key: ["friends", data.id],
    });

    // messageboxes
    const unfriendBox = useMessageBox();

    return (
        <div className="flex flex-col gap-2 grow">
            {unfriendBox.render({
                children:
                    "You are about to unfriend everyone and this is irreversible!",
                onSelect: (res) => {
                    if (res === "yes") {
                        modifyFriendship({
                            from_id: data.id,
                            type: "unfriend-all",
                        });
                    }
                },
            })}

            {/* friends topline */}
            <span className="flex  gap-2 items-center whitespace-nowrap">
                <Tooltip
                    text="Re-load friends"
                    direction="top"
                >
                    <Button
                        onClick={() => {
                            wrapPromise("friendsReload", async () => {
                                queryInvalidate({
                                    key: ["friends", data.id],
                                    silent: false,
                                });
                            });
                        }}
                    >
                        <PromiseState state="friendsReload" />
                        <Image
                            src="/reload.svg"
                            width={14}
                            height={14}
                            alt="refresh"
                        />
                    </Button>
                </Tooltip>

                <hr className="w-px! h-1/3 bg-background-a-10" />

                <span>Your friends</span>

                <small className="ml-auto text-ellipsis-left">
                    (all your friends are here)
                </small>
            </span>

            {/* friends list */}
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
                    {friends?.map((id) => (
                        <li key={id}>
                            <ProfileDisplay id={id} />
                        </li>
                    ))}
                </ul>
            )}

            <hr className="mt-auto" />
            <Button
                onClick={() => {
                    unfriendBox.show();
                }}
            >
                <PromiseState state="unfriendAll" />
                <Image
                    width={16}
                    height={16}
                    alt=""
                    src="/delete.svg"
                />
                Unfriend everyone
            </Button>
        </div>
    );
};
