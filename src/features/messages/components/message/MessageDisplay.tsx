import { ContextMenu } from "@/features/messages/components/message/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"]["messages"][number];
};

export const MessageDisplay = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <Modal
            direction="top"
            className={`w-fit! ${data.user_id === status?.id ? "ml-auto!" : ""}`}
            element={() => <ContextMenu />}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.5! px-5! w-fit! flex-row!`}
            >
                <div className="p-1">
                    <span>{data.message}</span>
                </div>

                <div className="mt-auto">
                    <small className="flex items-center gap-0.5">
                        {data.edited_at && (
                            <Image
                                alt=""
                                width={14}
                                height={14}
                                src="/pencil.svg"
                            />
                        )}
                        <span className="text-7!">
                            {exactTime(data.created_at)}
                        </span>
                    </small>
                </div>
            </Button>
        </Modal>
    );
};
