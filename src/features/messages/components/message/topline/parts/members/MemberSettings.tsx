import { Button } from "@/features/ui/button/components/Button";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversation_members"]["data"][number];
};

export const MemberSettings = ({ data }: Props) => {
    const kickBox = useMessageBox();
    const { data: status } = useQuery({ key: ["status"] });

    const isOurs = data.user.id === status?.id;

    return (
        <ul className="box p-4! gap-4! items-center">
            {kickBox.render({
                children: isOurs
                    ? "You will leave from this group!"
                    : "This user will be kicked from the group!",
                onSelect: (res) => {
                    if (!status) {
                        return;
                    }

                    if (res === "yes") {
                        updateConversationMembers({
                            type: "kick",
                            conversation_id: data.conversation_id,
                            user: status,
                            user_ids: [data.user.id],
                        });
                    }
                },
            })}

            <li>
                <span className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/settings.svg"
                    />
                    Member settings
                </span>
            </li>

            <li className="w-full">
                <Button
                    className="w-full"
                    onClick={kickBox.show}
                >
                    <div className="w-1 h-1 rounded-full bg-red-1" />
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/auth.svg"
                    />
                    {isOurs ? "Leave" : "Kick"}
                </Button>
            </li>
        </ul>
    );
};
