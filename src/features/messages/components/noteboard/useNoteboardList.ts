import { sortNotes } from "@/features/messages/utils/sort";
import { useQuery } from "@/query/core";
import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useMemo, useEffect } from "react";

export const useNoteboardList = () => {
    // url
    const { extra } = useParams<{ extra?: string }>();

    // zustand
    const updateNotebaord = useAppStore((state) => state.updateNoteboard);
    const notesDisplay = useAppStore((state) => state.display.notes);

    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: noteboards, isLoading } = useQuery({
        key: ["noteboards", status?.id],
        revalidate: true,
    });

    // ui states
    const selectedNoteboard = useMemo(() => {
        return noteboards?.find((d) => d.id === extra);
    }, [extra, noteboards]);
    const trimmedFilter = notesDisplay.filter.trim().toLowerCase();

    // filtering
    const filteredNoteboards = useMemo(() => {
        if (!noteboards) {
            return [];
        }

        return sortNotes({ notes: noteboards, filter: trimmedFilter, reversed: notesDisplay.reversed });
    }, [noteboards, trimmedFilter, notesDisplay.reversed]);

    // syncing
    useEffect(() => {
        if (!selectedNoteboard) {
            return;
        }

        updateNotebaord(selectedNoteboard);
    }, [selectedNoteboard, updateNotebaord]);

    // returning
    return useMemo(() => {
        return {
            noteboards: filteredNoteboards,
            isLoading,
            trimmedFilter,
        };
    }, [isLoading, trimmedFilter, filteredNoteboards]);
};
