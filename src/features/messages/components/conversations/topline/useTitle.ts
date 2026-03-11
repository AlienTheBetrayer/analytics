/** @format */

import { useAppStore } from "@/zustand/store";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useTitle = () => {
    // url
    const { tab, id, extra } = useParams<{
        tab?: string;
        id?: string;
        extra?: string;
    }>();

    // zustand
    const hasConversation = useAppStore((state) => !!state.conversations?.ids.length);
    const display = useAppStore((state) => state.display.conversations);

    // determining ui variables
    const variables = useMemo(() => {
        let color = "";
        let image = "";
        let text = "";

        // conversation absence
        if (!hasConversation) {
            color = "var(--red-1)";
            image = "/archive.svg";
            text = "No conversations";
        } else {
            color = "var(--blue-1)";
            image = "/cubes.svg";
            text = "Conversations";
        }

        // conversation tab
        switch (display.tab) {
            case "archive": {
                color = "var(--orange-1)";
                image = "/archive.svg";
                text = "Archived";
                break;
            }
        }

        switch (tab) {
            case "notes": {
                if (id === "board") {
                    color = "var(--blue-1)";
                    image = "/dashboard.svg";
                    text = extra ? "Note" : "Noteboard";
                } else {
                    color = "var(--blue-1)";
                    image = "/pencil.svg";
                    text = "Notes";
                }
                break;
            }
        }

        return { color, image, text };
    }, [hasConversation, display, extra, id, tab]);

    return variables;
};
