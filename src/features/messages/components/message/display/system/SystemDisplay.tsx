/** @format */

import { ContextMenu } from "@/features/messages/components/message/display/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import Image from "next/image";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]>;
};

export const SystemDisplay = ({ message }: Props) => {
    return (
        <Modal
            tooltipClassName="w-screen max-w-64"
            direction="left"
            className="w-fit mx-auto my-1"
            element={() => <ContextMenu message={message} />}
        >
            <Button className={`box not-hover:bg-bg-1! p-1.5! px-4! w-fit! flex-row!`}>
                <div className="w-1 h-1 bg-blue-2 rounded-full" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/settings.svg"
                />
                <span>{message.message ?? "System message"}</span>
            </Button>
        </Modal>
    );
};
