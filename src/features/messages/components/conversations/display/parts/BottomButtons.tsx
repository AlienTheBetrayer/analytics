/** @format */

import { ArchivedContextMenu } from "@/features/messages/components/conversations/archived/ArchivedContextMenu";
import { RegularContextMenu } from "@/features/messages/components/conversations/display/RegularContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import Image from "next/image";
import { ExpandedConversation } from "@/query-api/protocol/messages";

type Props =
    | {
          type: "regular";
          conversation: ExpandedConversation | null;
      }
    | {
          type: "notes";
          conversation: ExpandedConversation | null;
      }
    | { type: "archived"; isCollapsed: boolean };

export const BottomButtons = (props: Props) => {
    // ui states
    const contextElement =
        props.type === "archived" ? <ArchivedContextMenu /> : <RegularContextMenu conversation={props.conversation} />;

    // jsx
    return (
        <div
            className={`flex items-center gap-1 absolute right-4.5 bottom-1 translate-y-0 transition-all duration-300
                    ${props.type === "archived" && props.isCollapsed ? "translate-y-1/2! bottom-1/2!" : ""}`}
        >
            {props.type === "notes" && (
                <LinkButton
                    href="/messages/notes/board"
                    className="w-5! h-5! min-w-5! min-h-5! p-0! rounded-sm!"
                >
                    <small>
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/dashboard.svg"
                        />
                    </small>
                </LinkButton>
            )}

            <Modal
                tooltipClassName="w-screen max-w-64"
                element={() => contextElement}
                isActive={!!contextElement}
                direction="right"
            >
                <Button className="min-w-5! min-h-5! h-5! w-5! p-0! rounded-sm!">
                    <small>
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/menu.svg"
                        />
                    </small>
                </Button>
            </Modal>
        </div>
    );
};
