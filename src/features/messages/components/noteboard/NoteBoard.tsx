/** @format */

import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { NoNoteboards } from "@/features/messages/components/errors/NoNoteboards";
import { BoardDisplay } from "@/features/messages/components/noteboard/compact/BoardDisplay";
import { FullBoardDisplay } from "@/features/messages/components/noteboard/expanded/FullBoardDisplay";
import { NoteboardTopline } from "@/features/messages/components/noteboard/NoteboardTopline";
import { useNoteboardList } from "@/features/messages/components/noteboard/useNoteboardList";
import { useLocalStore } from "@/zustand/localStore";
import { useParams } from "next/navigation";

export const NoteBoard = () => {
    // url
    const { extra } = useParams<{ extra?: string }>();

    // zustand
    const display = useLocalStore((state) => state.display);
    const isCompact = display?.messages?.noteboard?.view === "compact";

    // noteboard + filtering
    const { isLoading, trimmedFilter, noteboards } = useNoteboardList();

    // fallbacks
    if (isLoading) {
        return <div className="loading w-full grow" />;
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
                {noteboards?.length ?
                    <ul
                        className={`grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] w-full
                    ${isCompact ? "flex! flex-col gap-2" : "gap-4"}`}
                    >
                        {noteboards.map((noteboard) => (
                            <li
                                className="w-full"
                                key={noteboard.id}
                            >
                                <BoardDisplay noteboard={noteboard} />
                            </li>
                        ))}
                    </ul>
                :   <div className="flex items-center justify-center grow loading">
                        {trimmedFilter ?
                            <FilterNothing type="notes" />
                        :   <NoNoteboards />}
                    </div>
                }
            </div>
        </>
    );
};
