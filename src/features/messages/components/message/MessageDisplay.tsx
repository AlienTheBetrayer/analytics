import { ContextMenu } from "@/features/messages/components/message/ContextMenu";
import { EditedAt } from "@/features/messages/components/message/parts/EditedAt";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";

type Props = {
    data: CacheAPIProtocol["messages"]["data"]["messages"][number];
    onEdit: () => void;
};

export const MessageDisplay = ({ data, onEdit }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <Modal
            direction="left"
            className={`w-fit! ${data.user_id === status?.id ? "ml-auto!" : ""}`}
            element={(hide) => (
                <ContextMenu
                    hide={hide}
                    data={data}
                    onEdit={onEdit}
                />
            )}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.5! px-5! w-fit! flex-row!`}
            >
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
