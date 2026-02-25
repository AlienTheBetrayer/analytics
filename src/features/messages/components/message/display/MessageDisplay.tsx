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

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    onEdit: () => void;
    onReply: () => void;
};

export const MessageDisplay = ({ data, conversationData, onEdit, onReply }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    if (data.type === "system") {
        return <SystemDisplay data={data} />;
    }   

    const isOurs = data.user_id === status?.id;

    return (
        <Modal
            direction={isOurs ? "left" : "right"}
            className={`w-fit! ${isOurs ? "ml-auto!" : ""}`}
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
                className={`box not-hover:bg-bg-1! p-1.5! px-4! w-fit! flex-row!`}
            >
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

                <div className="mt-auto">
                    <small className="flex items-center gap-0.5">
                        <EditedAt data={data} />
                        <span className="text-7!">
                            {exactTime(data.created_at)}
                        </span>
                    </small>
                </div>
            </Button>
        </Modal>
    );
};
