import { ContextMenu } from "@/features/messages/components/message/display/ContextMenu";
import { SystemDisplay } from "@/features/messages/components/message/display/system/SystemDisplay";
import { EditedAt } from "@/features/messages/components/message/parts/EditedAt";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    onEdit: () => void;
    onReply: () => void;
};

export const MessageDisplay = ({
    data,
    conversationData,
    onEdit,
    onReply,
}: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    switch (data.type) {
        case "system": {
            return <SystemDisplay data={data} />;
        }
    }

    const isOurs = data.user_id === status?.id;

    return (
        <Modal
            direction={isOurs ? "left" : "right"}
            className={`relative w-fit! ${isOurs ? "ml-auto!" : ""}`}
            element={(hide) => (
                <ContextMenu
                    hide={hide}
                    data={data}
                    onEdit={onEdit}
                    onReply={onReply}
                />
            )}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.75! px-4! w-fit! flex-col! rounded-3xl!`}
            >
                {data.reply && (
                    <div className="flex items-center p-2 gap-2 bg-bg-2 h-8 rounded-md w-full max-w-48">
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/back.svg"
                        />
                        <ProfileImage
                            profile={data.reply.user.profile}
                            width={256}
                            height={256}
                            className="w-5.5! h-5.5"
                        />
                        <span className="truncate">{data.reply.message}</span>
                    </div>
                )}

                <div className="flex items-center gap-1 relative w-full">
                    {((!isOurs && conversationData?.type === "group") ||
                        data.type === "forward") && (
                        <ProfileImage
                            profile={data.user.profile}
                            width={256}
                            height={256}
                            className="w-6! h-6!"
                        />
                    )}

                    {data.type === "loading" && (
                        <div className="absolute right-3 top-1.25">
                            <Spinner className="w-3! h-3!" />
                        </div>
                    )}

                    <div className="flex items-center gap-1 p-1">
                        <span>{data.message}</span>
                    </div>

                    <div className="mt-auto ml-auto">
                        <small className="flex items-center gap-0.5">
                            <EditedAt data={data} />
                            <span className="text-7!">
                                {exactTime(data.created_at)}
                            </span>
                        </small>
                    </div>
                </div>
            </Button>
        </Modal>
    );
};
