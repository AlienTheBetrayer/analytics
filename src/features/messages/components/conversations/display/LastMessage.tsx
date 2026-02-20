import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const LastMessage = ({ data }: Props) => {
    const messageInputs = useLocalStore((state) => state.messageInputs);
    const draft = data?.id && messageInputs[data.id];

    if (draft) {
        return (
            <span className="flex items-center gap-1 truncate">
                <span className="text-blue-2!">Draft:</span>
                <small>{draft}</small>
            </span>
        );
    }

    return (
        data?.last_message && (
            <small className="truncate">
                <span>{data.last_message.message}</span>
            </small>
        )
    );
};
