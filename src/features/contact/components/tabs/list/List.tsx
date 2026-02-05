import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

export const List = () => {
    // react states
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [reversed, setReversed] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <ul className="box p-0! h-10! flex-row! w-full items-center mt-6! md:mt-0!">
                <li>
                    <Tooltip text="Expanded / Collapsed">
                        <Button
                            className="p-0!"
                            onClick={() => {
                                setCollapsed((prev) => !prev);
                            }}
                        >
                            <Image
                                alt="+"
                                width={20}
                                height={20}
                                src="/collapse.svg"
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    !collapsed
                                        ? "var(--blue-1)"
                                        : "var(--orange-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip text="Sort direction">
                        <Button
                            className="p-0!"
                            onClick={() => {
                                setReversed((prev) => !prev);
                            }}
                        >
                            <Image
                                alt="+"
                                width={16}
                                height={16}
                                src="/sort.svg"
                                className="transition-all duration-500!"
                                style={{
                                    rotate: reversed ? `180deg` : `0deg`,
                                }}
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    !reversed
                                        ? "var(--blue-1)"
                                        : "var(--orange-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="flex items-center self-stretch!">
                    <hr className="w-px! h-1/2!" />
                </li>

                <li>
                    <Input
                        placeholder="Filter by title"
                        value={filter}
                        onChange={(value) => setFilter(value)}
                    />
                </li>

                <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cubes.svg"
                        />
                        Messages:
                    </span>
                </li>
            </ul>
        </div>
    );
};
