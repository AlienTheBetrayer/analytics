import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const Create = ({ conversationData }: Props) => {
    return <span>hi</span>;
};
