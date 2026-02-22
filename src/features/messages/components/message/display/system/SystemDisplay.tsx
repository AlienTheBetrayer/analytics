import { ContextMenu } from "@/features/messages/components/message/display/ContextMenu";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["messages"]["data"]["messages"][number];
};

export const SystemDisplay = ({ data }: Props) => {
    return (
        <Modal
            direction="left"
            className="w-fit mx-auto"
            element={() => <ContextMenu data={data}/>}
        >
            <Button
                className={`box not-hover:bg-bg-1! p-1.5! px-4! w-fit! flex-row!`}
            >
                <div className="w-1 h-1 bg-blue-2 rounded-full"/>
                <Image alt='' width={16} height={16} src="/settings.svg"/>
                <span>{data.message ?? "System message"}</span>
            </Button>
        </Modal>
    );
};
