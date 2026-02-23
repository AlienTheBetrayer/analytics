import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useParams } from "next/navigation";

export const NotesNav = () => {
    const { tab, id } = useParams<{ tab?: string; id?: string }>();

    return (
        <ul className="flex items-center gap-1">
            <li className="flex items-center gap-1">
                <Tooltip
                    direction="top"
                    text="Note messages"
                >
                    <LinkButton href="/messages/notes">
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/save.svg"
                        />
                        Notes
                        <TabSelection condition={id !== "board"} />
                    </LinkButton>
                </Tooltip>
            </li>

            <li className="flex items-center gap-1">
                <Tooltip
                    direction="top"
                    text="Noteboard"
                >
                    <LinkButton href="/messages/notes/board">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/dashboard.svg"
                        />
                        Board
                        <TabSelection condition={id === "board"} />
                    </LinkButton>
                </Tooltip>
            </li>
        </ul>
    );
};
