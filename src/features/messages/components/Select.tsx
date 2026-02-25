import { MessageView } from "@/features/messages/components/message/MessageView";
import { useParams } from "next/navigation";
import { Conversations } from "@/features/messages/components/conversations/Conversations";
import { AdditionalTopline } from "@/features/messages/components/topline/AdditionalTopline";
import { useSelect } from "@/features/messages/hooks/useSelect";

export type MessagesSelectResult =
    | "url"
    | "fetch"
    | "notselected"
    | "wrong"
    | "noteboard";
export type MessagesTab = "u" | "c" | "notes" | "none";

export const Select = () => {
    const { tab } = useParams<{ tab?: string }>();
    const { retrieved } = useSelect();

    return (
        <div className="flex flex-col gap-4 grow">
            <AdditionalTopline />

            <div className="w-full flex lg:grid lg:grid-cols-[40%_1fr] xl:grid-cols-[30%_1fr] grow gap-4 relative">
                <Conversations />

                <div
                    className={`flex flex-col overflow-hidden grow bg-bg-1 ${tab ? "absolute lg:relative inset-0 z-2" : "relative hidden lg:flex"}`}
                >
                    <MessageView retrieved={retrieved} />
                </div>
            </div>
        </div>
    );
};
