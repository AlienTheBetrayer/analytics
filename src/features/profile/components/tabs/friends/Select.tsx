import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";
import { Profile, User } from "@/types/tables/account";
import { Outcoming } from "./tabs/Outcoming";
import { Incoming } from "./tabs/Incoming";
import { Friends } from "./tabs/Friends";
import { useAppStore } from "@/zustand/store";

export type FriendsTab = "Friends" | "Incoming" | "Outcoming";

type Props = {
    data: { user: User; profile: Profile };
};

export const Select = ({ data }: Props) => {
    // zustand
    const friendRequests = useAppStore((state) => state.friendRequests);

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
            <div
                className={`box p-0! gap-1! my-2 flex-row! w-full m-auto transition-all duration-500 h-10 items-center`}
            >
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
                            condition={
                                !!friendRequests[data.user.id]?.incoming?.size
                            }
                            color="var(--orange-1)"
                        />
                    </Button>
                </Tooltip>

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
            </div>

            <hr />

            {element()}
        </div>
    );
};
