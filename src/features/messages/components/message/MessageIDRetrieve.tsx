import { MessageView } from "@/features/messages/components/message/MessageView";
import { MessagesTab } from "@/features/messages/components/Select";
import { useQuery } from "@/query/core";

type Props = {
    type: MessagesTab;
    id?: string;
};

export const MessageIDRetrieve = ({ type, id }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // fetching
    const { data: conversation_id } = useQuery({
        key:
            type === "notes"
                ? ["conversation_retrieve", type, status?.id]
                : ["conversation_retrieve", type, status?.id, id],
    });

    return <MessageView conversation_id={conversation_id ?? undefined} />;
};
