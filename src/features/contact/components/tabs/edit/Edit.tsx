import { NoMessage } from "@/features/contact/components/errors/NoMessage";
import { Send } from "@/features/contact/components/tabs/send/Send";
import { useQuery } from "@/query/core";
import { useParams } from "next/navigation";

export const Edit = () => {
    // url
    const { id } = useParams<{ id?: string }>();

    // fetching
    const { data, isLoading } = useQuery({ key: ["contact_message", id] });

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 h-full items-center">
                {Array.from({ length: 12 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full loading h-8"
                    />
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col gap-4 h-full items-center relative">
                {Array.from({ length: 12 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full loading h-8"
                    />
                ))}

                <div className="absolute left-1/2 top-1/2 -translate-1/2">
                    <NoMessage />
                </div>
            </div>
        );
    }

    return (
        <Send
            type="edit"
            data={data}
        />
    );
};
