import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const AddFriends = ({ conversationData }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <MiniSearch
            required
            text="Add"
            type="friends"
            view="select"
            onSelect={(user_ids) => {
                if (!status) {
                    return;
                }

                wrapPromise("addMembers", () => {
                    return updateConversationMembers({
                        type: "add",
                        user: status,
                        conversation_id: conversationData.id,
                        user_ids,
                    });
                });
            }}
            promiseState="addMembers"
        />
    );
};
