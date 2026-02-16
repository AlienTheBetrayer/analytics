import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const LastMessage = ({ data }: Props) => {
    return (
        data?.last_message && (
            <small className="truncate">
                <span>{data.last_message.message}</span>
            </small>
        )
    );
};
