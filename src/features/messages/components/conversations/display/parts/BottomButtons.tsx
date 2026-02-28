import { ArchivedContextMenu } from "@/features/messages/components/conversations/archived/ArchivedContextMenu";
import { NotesContextMenu } from "@/features/messages/components/conversations/notes/NotesContextMenu";
import { RegularContextMenu } from "@/features/messages/components/conversations/display/RegularContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props =
    | {
          type: "regular";
          data?: CacheAPIProtocol["conversations"]["data"][number];
      }
    | {
          type: "notes";
          data?: CacheAPIProtocol["conversations"]["data"][number];
      }
    | { type: "archived"; isCollapsed: boolean };

export const BottomButtons = (props: Props) => {
    // check is collapsed
    return (
        <div
            className={`flex items-center gap-1 absolute right-4 bottom-1 translate-y-0 transition-all duration-300
                    ${props.type === "archived" && props.isCollapsed ? "translate-y-1/2! bottom-1/2!" : ""}`}
        >
            {props.type === "notes" && (
                <LinkButton
                    href="/messages/notes/board"
                    className="w-6! h-6! p-0! min-w-6! min-h-6! rounded-lg!"
                >
                    <Image
                        alt=""
                        width={14}
                        height={14}
                        src="/dashboard.svg"
                    />
                </LinkButton>
            )}

            <Modal
                tooltipClassName="w-screen max-w-64"
                element={() =>
                    props.type === "regular" ? (
                        <RegularContextMenu data={props.data} />
                    ) : props.type === "archived" ? (
                        <ArchivedContextMenu />
                    ) : props.type === "notes" ? (
                        <NotesContextMenu data={props.data} />
                    ) : null
                }
                direction="right"
            >
                <Button className="min-w-6! min-h-6! h-6! w-6! p-0! rounded-lg!">
                    <Image
                        alt=""
                        width={14}
                        height={14}
                        src="/menu.svg"
                    />
                </Button>
            </Modal>
        </div>
    );
};
