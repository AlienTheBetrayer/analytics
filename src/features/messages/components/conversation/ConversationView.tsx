import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { useQuery } from "@/query/core";

type Props = {
    conversation_id?: string;
};

export const ConversationView = ({ conversation_id }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    if (!status || !conversation_id) {
        return <div className="w-full h-full loading flex items-center justify-center" >
            <NotSelected/>
        </div>
        
    }


};

type IdProps = {
    conversation_id: string;
}
const ConversationViewId = ({ conversation_id}: Props) => {
    const { data: messages, isLoading } = useQuery({ key: ["messages", conversation_id]});
    

    if (!isLoading) {
        return <div className="w-full h-full loading" />;
    }

    return (
        <article className="p-4!">
            <span>conversation view</span>
        </article>
    );
}
