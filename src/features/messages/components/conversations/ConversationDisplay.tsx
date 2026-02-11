import { ContextMenu } from "@/features/messages/components/conversations/ContextMenu";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ConversationDisplay = ({ data }: Props) => {
    const { id } = useParams<{ id?: string }>();
    const { data: status } = useQuery({ key: ["status"] });

    const otherUser = data.conversation_members.find(
        (m) => m.user_id !== status?.id,
    )?.user;

    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! rounded-4xl! justify-start! items-start! gap-4!
                ${id === data.id ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={`/messages/${data.id}`}
            >
                <ProfileImage
                    profile={otherUser?.profile}
                    width={256}
                    height={256}
                    className="w-12! h-12!"
                />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <span className="truncate">{otherUser?.username}</span>

                        {data.last_message && (
                            <span className="flex items-center gap-1 ml-auto! whitespace-nowrap">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src={
                                        data.last_message.seen_at
                                            ? "/seen.svg"
                                            : "/checkmark.svg"
                                    }
                                />
                                <small>
                                    {exactTime(data.last_message.created_at)}
                                </small>
                            </span>
                        )}
                    </div>

                    {data.last_message && (
                        <small className="truncate">
                            <span>{data.last_message.message}</span>
                        </small>
                    )}
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
