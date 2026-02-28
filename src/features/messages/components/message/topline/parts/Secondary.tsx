import { Selectable } from "@/features/messages/components/message/topline/parts/Selectable";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { TabSelection } from "@/utils/other/TabSelection";
import { useAppStore } from "@/zustand/store";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
};

export const Secondary = ({ data }: Props) => {
    const display = useAppStore((state) => state.display.messages);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    const { id } = useParams<{
        id?: string;
    }>();

    if (id === "board") {
        return null;
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {display.selectingMode && <Selectable />}
            </AnimatePresence>

            <ul
                className={`box min-h-10! h-10! gap-1! p-0! items-center! flex-row!
                    ${!data?.length ? "opacity-30" : ""}`}
                inert={!data?.length || display.selectingMode}
            >
                {!data?.length && (
                    <li className="absolute left-1/2 top-1/2 -translate-1/2 z-1">
                        <span className="flex items-center gap-1">
                            <div className="bg-blue-1 rounded-full w-1 h-1" />
                            <span className="whitespace-nowrap">
                                Send a <mark>message</mark> to access
                            </span>
                        </span>
                    </li>
                )}

                <li>
                    <Tooltip
                        direction="bottom"
                        text="Sorting direction"
                    >
                        <Button
                            onClick={() =>
                                updateDisplay({
                                    messages: {
                                        reversed: !display.reversed,
                                    },
                                })
                            }
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/sort.svg"
                                className={`${display.reversed ? "rotate-180" : ""} duration-500!`}
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    display.reversed
                                        ? "var(--orange-1)"
                                        : "var(--blue-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip text="Filter by title">
                        <Input
                            placeholder="Filter..."
                            value={display.filter}
                            onChange={(value) =>
                                updateDisplay({
                                    messages: { filter: value },
                                })
                            }
                        />
                    </Tooltip>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Enter selection mode">
                        <Button
                            onClick={() => {
                                updateDisplay({
                                    messages: { selectingMode: true },
                                });
                            }}
                        >
                            <Image
                                alt=""
                                width={13}
                                height={13}
                                src="/select.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>
        </div>
    );
};
