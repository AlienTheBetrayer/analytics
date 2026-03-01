import { MemberDisplay } from "@/features/messages/components/message/topline/parts/members/display/MemberDisplay";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const MembersList = ({ conversationData }: Props) => {
    const { data, isLoading } = useQuery({
        key: ["conversation_members", conversationData.id],
        revalidate: true,
    });

    if (isLoading || !data) {
        return (
            <div className="flex flex-col gap-2 justify-between relative">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-6 loading"
                    />
                ))}

                <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2 items-center">
            {data.map((m) => (
                <li
                    key={m.user.id}
                    className="flex items-center gap-4 w-full!"
                >
                    <MemberDisplay data={m} />
                </li>
            ))}
        </ul>
    );
};
