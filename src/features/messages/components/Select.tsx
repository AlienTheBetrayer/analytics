import { NotSelected } from "@/features/messages/components/errors/NotSelected";
import { MessageView } from "@/features/messages/components/message/MessageView";
import { MessageIDRetrieve } from "@/features/messages/components/message/MessageIDRetrieve";
import { useParams } from "next/navigation";

export type MessagesTab = "u" | "c" | "notes" | "none";

export const Select = () => {
    const { id, tab } = useParams<{ tab?: string; id?: string }>();

    // jsx selector
    switch (tab) {
        case "c": {
            if (!id) {
                break;
            }

            return <MessageView conversation_id={id} />;
        }
        case "u": {
            if (!id) {
                break;
            }

            return (
                <MessageIDRetrieve
                    type="u"
                    id={id}
                />
            );
        }
        case "notes": {
            return <MessageIDRetrieve type="notes" />;
        }
        default: {
            break;
        }
    }

    // fallback if none of the above worked
    return (
        <div className="flex items-center justify-center relative grow loading">
            <NotSelected />
        </div>
    );
};
