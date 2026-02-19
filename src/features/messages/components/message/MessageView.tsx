import { NoMessages } from "@/features/messages/components/errors/NoMessages";
import { MessageDisplay } from "@/features/messages/components/message/MessageDisplay";
import { MessageInput } from "@/features/messages/components/message/MessageInput";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { MessagesTopline } from "@/features/messages/components/message/topline/MessagesTopline";
import { useAppStore } from "@/zustand/store";
import { NoteBoard } from "@/features/messages/components/noteboard/NoteBoard";
import { WrongURL } from "@/features/messages/components/errors/WrongURL";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";

type Props = {
    retrieved?: CacheAPIProtocol["conversation_retrieve"]["data"];
};
export const MessageView = ({ retrieved }: Props) => {
    // won't load if we have no conversation_id
    const { data, isLoading } = useQuery({
        key: ["messages", retrieved?.conversation_id ?? undefined],
    });
    const selectDisplay = useAppStore((state) => state.selectDisplay);

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col justify-between gap-2 grow">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-14 loading"
                    />
                ))}
            </div>
        );
    }

    switch (selectDisplay) {
        case "notselected": {
            return (
                <div className="flex items-center justify-center relative grow loading">
                    <NotSelected />
                </div>
            );
        }
        case "wrong": {
            return (
                <div className="flex items-center justify-center relative grow loading">
                    <WrongURL />
                </div>
            );
        }
        case "noteboard": {
            return (
                <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
                    <MessagesTopline
                        data={data}
                        retrieved={retrieved}
                    />
                    <NoteBoard />
                </article>
            );
        }
    }

    return (
        <article className="flex flex-col bg-bg-2! grow p-4! gap-2 rounded-4xl">
            <MessagesTopline
                data={data}
                retrieved={retrieved}
            />

            <ul className="flex flex-col-reverse gap-0.5 grow relative">
                {data?.messages?.length ? (
                    data.messages.map((message) => (
                        <li key={message.id}>
                            <MessageDisplay data={message} />
                        </li>
                    ))
                ) : (
                    <div className="opacity-50 pointer-events-none select-none">
                        <NoMessages />
                    </div>
                )}
            </ul>

            <MessageInput
                data={data}
                retrieved={retrieved}
            />
        </article>
    );
};
