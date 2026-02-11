import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay } from "@/features/messages/components/message/MessageDisplay";
import { useQuery } from "@/query/core";

type Props = {
    conversation_id: string;
};

export const MessageList = ({ conversation_id }: Props) => {
    // fetching
    const { data: messages, isLoading } = useQuery({
        key: ["messages", conversation_id],
    });
    const { data: status } = useQuery({ key: ["status"] });

    // fallbacks
    if (isLoading || !status) {
        return (
            <div className="flex flex-col gap-2 grow">
                {Array.from({ length: 7 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-12 loading"
                    />
                ))}
            </div>
        );
    }

    if(!messages?.length) {
        return <div className="grow relative">
            <NoMessages/>
        </div>
    }

    return (
        <ul className="flex flex-col-reverse gap-4 grow">
            {messages.map((message) => (
                <li key={message.id}>
                    <MessageDisplay
                        message={message}
                        status={status}
                    />
                </li>
            ))}
        </ul>
    );
};
