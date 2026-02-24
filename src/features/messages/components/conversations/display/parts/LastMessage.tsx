import { LastMessageAuthor } from "@/features/messages/components/conversations/display/parts/LastMessageAuthor";
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
            <span className="flex items-center gap-1">
                <span className="text-blue-2!">Draft:</span>
                <small className="truncate">{draft}</small>
            </span>
        );
    }

    return (
        data?.last_message && (
            <small className="flex items-center gap-1 truncate">
                <LastMessageAuthor data={data} />
                <span>{data.last_message.message}</span>
            </small>
        )
    );
};
