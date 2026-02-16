import { NoNotes } from "@/features/messages/components/errors/NoNotes";
import { BoardDisplay } from "@/features/messages/components/noteboard/BoardDisplay";
import { FullBoardDisplay } from "@/features/messages/components/noteboard/FullBoardDisplay";
import { NoteboardTopline } from "@/features/messages/components/noteboard/NoteboardTopline";
import { useQuery } from "@/query/core";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const NoteBoard = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({ key: ["noteboards", status?.id] });
    const { extra } = useParams<{ extra?: string }>();

    // ui states
    const extraTab = useMemo(() => {
        return data?.find((d) => d.id === extra);
    }, [extra, data]);

    // fallbacks
    if (isLoading) {
        return <div className="loading w-full grow" />;
    }

    if (!data?.length) {
        return (
            <>
                <NoteboardTopline data={extraTab} />
                <div className="loading w-full grow flex items-center justify-center">
                    <NoNotes />
                </div>
            </>
        );
    }

    if (extra) {
        return (
            <>
                <NoteboardTopline data={extraTab} />

                <div className="flex w-full grow">
                    <FullBoardDisplay data={extraTab} />
                </div>
            </>
        );
    }

    return (
        <>
            <NoteboardTopline data={extraTab} />

            <div className="flex w-full grow">
                <ul>
                    {data.map((d) => (
                        <li key={d.id}>
                            <BoardDisplay data={d} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
