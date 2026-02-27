import { MiniSearch } from "@/features/minisearch/components/MiniSearch";
import { wrapPromise } from "@/promises/core";
import { upsertConversation } from "@/query-api/calls/conversation";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const AddFriends = ({ conversationData }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <div className="flex flex-col gap-2">
            <div className="box acrylic p-3! items-center">
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-1 rounded-full" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/friends.svg"
                    />
                    <span className="truncate max-w-42">
                        Add to {conversationData.title || "conversation"}
                    </span>
                </span>
            </div>

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
        </div>
    );
};
