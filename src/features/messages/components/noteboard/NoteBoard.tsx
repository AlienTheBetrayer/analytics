import { NoNotes } from "@/features/messages/components/errors/NoNotes";
import { useQuery } from "@/query/core";

export const NoteBoard = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["noteboards", status?.id] });

    if (isLoading) {
        return <div className="loading w-full grow flex" />;
    }

    if (data && !data.length) {
        return (
            <div className="loading w-full grow flex items-center justify-center">
                <NoNotes />
            </div>
        );
    }

    return (
        <div className="flex w-full grow">
            <span>loaded</span>
        </div>
    );
};
