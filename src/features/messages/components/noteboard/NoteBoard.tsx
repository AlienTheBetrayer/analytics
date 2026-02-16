import { NoNotes } from "@/features/messages/components/errors/NoNotes";
import { BoardDisplay } from "@/features/messages/components/noteboard/BoardDisplay";
import { useQuery } from "@/query/core";

export const NoteBoard = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["noteboards", status?.id] });

    if (isLoading) {
        return <div className="loading w-full grow flex" />;
    }

    if (!data?.length) {
        return (
            <div className="loading w-full grow flex items-center justify-center">
                <NoNotes />
            </div>
        );
    }

    return (
        <div className="flex w-full grow">
            <ul>

            {data.map(d => (
                <li key={d.id}>
                    <BoardDisplay data={d}/>
                </li>
            ))}
            </ul>
        </div>
    );
};
