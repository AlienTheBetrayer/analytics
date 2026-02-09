import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { FriendsTab } from "@/features/profile/components/tabs/friends/FriendsTab";

export type FriendsTab = "Friends" | "Incoming" | "Outcoming";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Select = ({ data }: Props) => {
    const [selected, setSelected] = useState<FriendsTab>("Friends");

    const element = () => {
        switch (selected) {
            case "Friends": {
                return (
                    <FriendsTab
                        data={data}
                        fetchKey="friends"
                    />
                );
            }
            case "Incoming": {
                return (
                    <FriendsTab
                        data={data}
                        fetchKey="requests_incoming"
                    />
                );
            }
            case "Outcoming": {
                return (
                    <FriendsTab
                        data={data}
                        fetchKey="requests_outcoming"
                    />
                );
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <ul
                className={`box p-0! gap-1! flex-row! w-full transition-all duration-500 min-h-10 h-10 items-center`}
            >
                <li>
                    <Tooltip
                        text="Your friends"
                        direction="top"
                    >
                        <Button
                            className={`p-0! md:px-2!`}
                            onClick={() => {
                                setSelected("Friends");
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="friends"
                                src="/friends.svg"
                            />
                            <span className="hidden md:block">Friends</span>
                            <TabSelection
                                condition={selected === "Friends"}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="flex h-full">
                    <hr className="self-center w-px! h-1/3!" />
                </li>

                <li>
                    <Tooltip
                        text="Incoming friend requests"
                        direction="top"
                    >
                        <Button
                            className={`p-0! md:px-2!`}
                            onClick={() => {
                                setSelected("Incoming");
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="incoming"
                                src="/arrow.svg"
                            />
                            <span className="hidden md:block">Incoming</span>
                            <TabSelection
                                condition={selected === "Incoming"}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip
                        text="Outcoming friend requests"
                        direction="top"
                    >
                        <Button
                            className={`p-0! md:px-2!`}
                            onClick={() => {
                                setSelected("Outcoming");
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="outcoming"
                                src="/pencil.svg"
                            />
                            <span className="hidden md:block">Outcoming</span>
                            <TabSelection
                                condition={selected === "Outcoming"}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Re-fetch data">
                        <Button
                            onClick={() => {
                                wrapPromise("friendsTabReload", async () => {
                                    return queryInvalidate({
                                        key: [
                                            selected === "Friends"
                                                ? "friends"
                                                : selected === "Incoming"
                                                  ? "requests_incoming"
                                                  : "requests_outcoming",
                                            data.id,
                                        ],
                                        silent: false,
                                    });
                                });
                            }}
                        >
                            <PromiseState state="friendsTabReload" />
                            <Image
                                src="/reload.svg"
                                width={14}
                                height={14}
                                alt="refresh"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <hr />

            {element()}
        </div>
    );
};
