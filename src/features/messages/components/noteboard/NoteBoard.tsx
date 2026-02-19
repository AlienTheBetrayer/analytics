import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoNoteboards } from "@/features/messages/components/errors/NoNoteboards";
import { BoardDisplay } from "@/features/messages/components/noteboard/compact/BoardDisplay";
import { FullBoardDisplay } from "@/features/messages/components/noteboard/expanded/FullBoardDisplay";
import { NoteboardTopline } from "@/features/messages/components/noteboard/NoteboardTopline";
import { sortNotes } from "@/features/messages/utils/sort";
import { useQuery } from "@/query/core";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";
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
    const display = useLocalStore((state) => state.display);
    const notesDisplay = useAppStore((state) => state.display.notes);
    const isCompact = display?.messages?.noteboard?.view === "compact";

    // fallbacks
    if (isLoading) {
        return <div className="loading w-full grow" />;
    }

    if (!data?.length) {
        return (
            <>
                <NoteboardTopline data={extraTab} />
                <div className="loading w-full grow flex items-center justify-center">
                    <NoNoteboards />
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

    const sorted = sortNotes({
        notes: data,
        filter: notesDisplay.filter,
        reversed: notesDisplay.reversed,
    });

    return (
        <>
            <NoteboardTopline data={extraTab} />

            <div className="flex w-full grow">
                {sorted.length ? (
                    <ul
                        className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] w-full
                    ${isCompact ? "flex! flex-col gap-2" : "gap-4"}`}
                    >
                        {sorted.map((d) => (
                            <li
                                className="w-full"
                                key={d.id}
                            >
                                <BoardDisplay data={d} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <li className="flex items-center justify-center grow">
                        <FilterNothing type="notes" />
                    </li>
                )}
            </div>
        </>
    );
};
