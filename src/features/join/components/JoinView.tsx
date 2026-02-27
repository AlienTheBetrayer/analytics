import { NoInvitation } from "@/features/join/components/errors/NoInvitation";
import { JoinDisplay } from "@/features/join/components/JoinDisplay";
import { useQuery } from "@/query/core";

type Props = {
    id: string;
};

export const JoinView = ({ id }: Props) => {
    const { data: status } = useQuery({
        key: ["status"],
    });
    const { data, isLoading } = useQuery({
        key: ["invitation", id, status?.id ?? null],
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-between grow gap-2 p-4">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-12 loading"
                    />
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center p-4 grow bg-bg-1 rounded-4xl!">
                <div className="loading rounded-4xl p-4">
                    <NoInvitation />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 grow">
            <JoinDisplay data={data} />
        </div>
    );
};
