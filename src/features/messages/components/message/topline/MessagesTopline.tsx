import { Main } from "@/features/messages/components/message/topline/parts/Main";
import { Secondary } from "@/features/messages/components/message/topline/parts/Secondary";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["messages"]["data"] | null;
    conversationData?: CacheAPIProtocol["conversations"]["data"][number];
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};

export const MessagesTopline = ({
    conversationData,
    data,
    retrieved,
}: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <Main
                data={data}
                conversationData={conversationData}
                retrieved={retrieved}
            />
            <Secondary data={data} />
        </div>
    );
};
