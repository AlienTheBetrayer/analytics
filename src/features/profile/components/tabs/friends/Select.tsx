import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";
import { Outcoming } from "./tabs/Outcoming";
import { Incoming } from "./tabs/Incoming";
import { Friends } from "./tabs/Friends";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

export type FriendsTab = "Friends" | "Incoming" | "Outcoming";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Select = ({ data }: Props) => {
    // fetching
    const { data: requests_outcoming } = useQuery({
        key: ["requests_outcoming", data.id],
    });
    const { data: requests_incoming } = useQuery({
        key: ["requests_incoming", data.id],
    });

    const [selected, setSelected] = useState<FriendsTab>("Friends");

    const element = () => {
        switch (selected) {
            case "Friends": {
                return <Friends data={data} />;
            }
            case "Incoming": {
                return <Incoming data={data} />;
            }
            case "Outcoming": {
                return <Outcoming data={data} />;
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
                            <TabSelection
                                condition={!!requests_incoming?.length}
                                color="var(--orange-1)"
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
                            <TabSelection
                                condition={!!requests_outcoming?.length}
                                color="var(--orange-1)"
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
