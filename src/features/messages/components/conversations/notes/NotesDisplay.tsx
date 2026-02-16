import { LastMessage } from "@/features/messages/components/conversations/display/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/LastMessageDate";
import { ContextMenu } from "@/features/messages/components/conversations/notes/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const NotesDisplay = ({ data }: Props) => {
    const { tab } = useParams<{ tab?: string }>();
    const isSelected = tab === "notes";

    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! h-20! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={isSelected ? "/messages/" : `/messages/notes`}
            >
                <div
                    className="relative rounded-full w-12 h-12 flex items-center justify-center bg-bg-3 shrink-0 
                    bg-linear-to-br from-[#5367ff] to-[#222e86]"
                >
                    <Image
                        alt="notes"
                        src="/save.svg"
                        width={24}
                        height={24}
                        className="w-6! h-6! invert-90!"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <span>Notes</span>
                        <LastMessageDate data={data} />
                    </div>

                    <LastMessage data={data} />
                </div>

                {data?.conversation_meta?.pinned && (
                    <div className="absolute right-4 top-2">
                        <small>
                            <Image
                                alt="pin"
                                width={16}
                                height={16}
                                src="/pin.svg"
                            />
                        </small>
                    </div>
                )}
            </LinkButton>

            <div className="absolute right-4 bottom-2">
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
