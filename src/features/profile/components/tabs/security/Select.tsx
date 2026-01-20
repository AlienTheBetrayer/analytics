import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";
import { Data } from "./tabs/Data";
import { Profile, User } from "@/types/tables/account";
import { Sessions } from "./tabs/Sessions";

export type SecurityTab = "Data" | "Sessions";

type Props = {
    data: { user: User; profile: Profile };
};

export const Select = ({ data }: Props) => {
    // react states
    const [selected, setSelected] = useState<SecurityTab>("Data");

    const element = () => {
        switch (selected) {
            case "Data": {
                return <Data data={data} />;
            }
            case "Sessions": {
                return <Sessions data={data} />;
            }
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <ul
                className={`box p-0! gap-1! flex-row! w-full  transition-all duration-500 min-h-10 h-10 items-center`}
            >
                <li>
                    <Tooltip
                        text="Valuable authentication data"
                        direction="top"
                    >
                        <Button
                            className={`p-0! md:px-2!`}
                            onClick={() => {
                                setSelected("Data");
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="data"
                                src="/cube.svg"
                            />
                            <span className="hidden md:block">Data</span>
                            <TabSelection
                                condition={selected === "Data"}
                                color="var(--blue-1)"
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip
                        text="Logged in sessions"
                        direction="top"
                    >
                        <Button
                            className={`p-0! md:px-2!`}
                            onClick={() => {
                                setSelected("Sessions");
                            }}
                        >
                            <Image
                                width={16}
                                height={16}
                                alt="sessions"
                                src="/auth.svg"
                            />
                            <span className="hidden md:block">Sessions</span>
                            <TabSelection
                                condition={selected === "Sessions"}
                                color="var(--blue-1)"
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
