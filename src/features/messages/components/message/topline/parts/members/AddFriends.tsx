import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
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
            onSelect={(ids) => {
                if (!status) {
                    return;
                }

                wrapPromise("addMembers", () => {
                    return upsertConversation({
                        type: "add_members",
                        user: status,
                        conversation_id: conversationData.id,
                        ids,
                    });
                });
            }}
            promiseState="addMembers"
        />
    );
};
