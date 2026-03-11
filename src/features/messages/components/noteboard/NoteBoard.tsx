/** @format */

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
import { useEffect, useMemo } from "react";

export const NoteBoard = () => {
    const { extra } = useParams<{ extra?: string }>();
    const updateNotebaord = useAppStore((state) => state.updateNoteboard);
    const display = useLocalStore((state) => state.display);
    const notesDisplay = useAppStore((state) => state.display.notes);
    const isCompact = display?.messages?.noteboard?.view === "compact";

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: noteboards, isLoading } = useQuery({
        key: ["noteboards", status?.id],
        revalidate: true,
    });

    // syncing
    const selectedNoteboard = useMemo(() => {
        return noteboards?.find((d) => d.id === extra);
    }, [extra, noteboards]);

    useEffect(() => {
        updateNotebaord(selectedNoteboard);
    }, [selectedNoteboard, updateNotebaord]);



    const { sorted } = useMemo(() => {
        return { sorted: [] };
        
        // const sorted = sortNotes({
        //     notes: noteboards!,
        //     filter: notesDisplay.filter,
        //     reversed: notesDisplay.reversed,
        // });

        // return { sorted };
    }, [noteboards, notesDisplay]);

        // fallbacks
    if (isLoading) {
        return <div className="loading w-full grow" />;
    }

    if (!noteboards?.length) {
        return (
            <>
                <NoteboardTopline />
                <div className="loading w-full grow flex items-center justify-center">
                    <NoNoteboards />
                </div>
            </>
        );
    }

    if (extra) {
        return (
            <>
                <NoteboardTopline />

                <div className="flex w-full grow">
                    <FullBoardDisplay />
                </div>
            </>
        );
    }

    return (
        <>
            <NoteboardTopline />

            <div className="flex w-full grow">
                {sorted.length ?
                    <ul
                        className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] w-full
                    ${isCompact ? "flex! flex-col gap-2" : "gap-4"}`}
                    >
                        {sorted.map((noteboard) => (
                            <li
                                className="w-full"
                                key={"noteboard.id"}
                            >
                                <BoardDisplay noteboard={noteboard} />
                            </li>
                        ))}
                    </ul>
                :   <li className="flex items-center justify-center grow">
                        <FilterNothing type="notes" />
                    </li>
                }
            </div>
        </>
    );
};
