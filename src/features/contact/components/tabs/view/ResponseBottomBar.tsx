import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";

type Props = {
    tab: "view" | "admin";
    data: CacheAPIProtocol["contact_message"]["data"] | null;
    onSelect: (tab: "view" | "admin") => void;
};

export const ResponseBottomBar = ({ tab, data, onSelect }: Props) => {
    return (
        <ul className="box h-10! p-0! flex-row! items-center! gap-1!">
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div className="w-1 h-1 bg-blue-1 rounded-full aspect-square" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
            </li>

            <li>
                <Tooltip
                    text="User's view"
                    direction="top"
                >
                    <Button onClick={() => onSelect("view")}>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/eye.svg"
                        />
                        View
                        <TabSelection condition={tab === "view"} />
                    </Button>
                </Tooltip>
            </li>

            <li>
                <Tooltip
                    text="Modify a response"
                    direction="top"
                >
                    <Button onClick={() => onSelect("admin")}>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/arrow.svg"
                        />
                        Admin
                        <TabSelection condition={tab === "admin"} />
                    </Button>
                </Tooltip>
            </li>
        </ul>
    );
};
