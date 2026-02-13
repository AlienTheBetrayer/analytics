import { MessageView } from "@/features/messages/components/message/MessageView";
import { useParams } from "next/navigation";
import { useQuery } from "@/query/core";
import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { NotSelected } from "@/features/messages/components/errors/NotSelected";

export type MessagesTab = "u" | "c" | "notes" | "none";

export const Select = () => {
    const { id, tab } = useParams<{ tab?: string; id?: string }>();

    // retrieving conversation_id from url if: present id & tab is not already "c"
    const { data: status } = useQuery({ key: ["status"] });
    const { data: conversation_id } = useQuery({
        key: ["conversation_retrieve", tab, status?.id, id ?? null],
        trigger: !!((tab !== "c" && id) || tab === "notes"),
    });

    let cid = null;

    // jsx selector
    switch (tab) {
        case "c": {
            if (!id) {
                break;
            }

            cid = id;
            break;
        }
        case "u": {
            if (!id) {
                break;
            }

            cid = conversation_id;
            break;
        }
        case "notes": {
            cid = conversation_id;
            break;
        }
    }

    // not selected anything
    if (!id && !tab) {
        return (
            <div className="grid grid-cols-[30%_1fr] grow gap-4">
                <Conversations />

                <div className="flex items-center justify-center relative grow loading">
                    <NotSelected />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[30%_1fr] grow gap-4">
            <Conversations conversation_id={cid} />
            <MessageView conversation_id={cid} />
        </div>
    );
};
