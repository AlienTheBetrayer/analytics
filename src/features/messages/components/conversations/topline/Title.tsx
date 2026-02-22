import { SelectPart } from "@/features/messages/components/conversations/topline/SelectPart";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useAppStore } from "@/zustand/store";
import { motion } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"] | null;
};

export const Title = ({ data }: Props) => {
    let color = "";
    let image = "";
    let text = "";

    // sources
    const display = useAppStore((state) => state.display.conversations);
    const { tab, id, extra } = useParams<{
        tab?: string;
        id?: string;
        extra?: string;
    }>();

    // conversation absence
    if (!data?.length) {
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

    return (
        <motion.span
            className="flex items-center gap-1 whitespace-nowrap"
            key={`${color}${image}${text}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div
                className="w-1 h-1 rounded-full"
                style={{
                    background: color ?? "var(--red-1)",
                }}
            />

            {image && (
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src={image}
                />
            )}

            <span>{text ?? "Unknown"}</span>
            <SelectPart />
        </motion.span>
    );
};
