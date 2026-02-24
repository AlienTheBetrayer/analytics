import { Time } from "@/features/messages/components/topline/Time";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { TabSelection } from "@/utils/other/TabSelection";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useParams } from "next/navigation";

export const AdditionalTopline = () => {
    const isMaximized = useAppStore((state) => state.display.maximized);
    const updateDisplay = useAppStore((state) => state.updateDisplay);
    const { tab } = useParams<{ tab?: string }>();

    return (
        <ul className="box h-10! p-0! bg-bg-2! flex-row! items-center!">
            {/* left */}

            {/* center */}
            <li className="absolute left-1/2 top-1/2 -translate-1/2">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Time />
                </span>
            </li>

            {/* right */}
            <li className="ml-auto!">
                <ul className="flex items-center gap-1">
                    <li>
                        <Tooltip text="Back">
                            <LinkButton
                                href="/messages"
                                className="p-0! not-hover:bg-bg-1!"
                            >
                                <Image
                                    alt="-"
                                    width={16}
                                    height={16}
                                    src="/back.svg"
                                />
                                <TabSelection
                                    condition={!!tab}
                                    color="var(--blue-1)"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Maximize">
                            <Button
                                className="p-0! not-hover:bg-bg-1!"
                                onClick={() => {
                                    updateDisplay({ maximized: !isMaximized });
                                }}
                            >
                                <Image
                                    alt="[]"
                                    width={24}
                                    height={24}
                                    src="/collapse.svg"
                                />
                                <TabSelection
                                    condition={true}
                                    color={
                                        !isMaximized
                                            ? "var(--blue-1)"
                                            : "var(--orange-1)"
                                    }
                                />
                            </Button>
                        </Tooltip>
                    </li>

                    <li>
                        <Tooltip text="Home">
                            <LinkButton
                                href="/home"
                                className="p-0! not-hover:bg-bg-1!"
                            >
                                <Image
                                    alt="x"
                                    width={16}
                                    height={16}
                                    src="/cross.svg"
                                />
                            </LinkButton>
                        </Tooltip>
                    </li>
                </ul>
            </li>
        </ul>
    );
};
