import { ContextMenu } from "@/features/messages/components/conversations/ContextMenu";
import { Avatar } from "@/features/messages/components/conversations/display/Avatar";
import { LastMessage } from "@/features/messages/components/conversations/display/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/LastMessageDate";
import { Name } from "@/features/messages/components/conversations/display/Name";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    isSelected?: boolean;
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ConversationDisplay = ({ isSelected, data }: Props) => {
    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={isSelected ? "/messages/" : `/messages/c/${data.id}`}
            >
                <Avatar data={data} />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <Name data={data} />
                        <LastMessageDate data={data} />
                    </div>

                    <LastMessage data={data} />
                    <span>
                        archive: {String(data.conversation_meta?.archived)}
                    </span>
                    <span>pin: {String(data.conversation_meta?.pinned)}</span>
                </div>
            </LinkButton>

            <div className="absolute right-2 bottom-2">
                <Modal
                    element={() => <ContextMenu data={data} />}
                    direction="right"
                >
                    <Button className="min-w-6! min-h-6! h-6! w-6! p-0!">
                        <Image
                            alt=""
                            width={12}
                            height={12}
                            src="/menu.svg"
                        />
                    </Button>
                </Modal>
            </div>
        </div>
    );
};
