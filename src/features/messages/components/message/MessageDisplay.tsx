import { ContextMenu } from "@/features/messages/components/message/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { exactTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    message: CacheAPIProtocol["messages"]["data"][number];
    status: CacheAPIProtocol["status"]["data"];
};

export const MessageDisplay = ({ message, status }: Props) => {
    return (
        <Modal
            direction="top"
            className={`w-fit! ${message.user_id === status.id ? "ml-auto!" : ""}`}
            element={() => <ContextMenu />}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.5! px-5! w-fit! flex-row!`}
            >
                <div className="p-1">
                    <span>{message.message}</span>
                </div>

                <div className="mt-auto">
                    <small className="flex items-center gap-0.5">
                        {message.edited_at && (
                            <Image
                                alt=""
                                width={14}
                                height={14}
                                src="/pencil.svg"
                            />
                        )}
                        <span className="text-7!">
                            {exactTime(message.created_at)}
                        </span>
                    </small>
                </div>
            </Button>
        </Modal>
    );
};
