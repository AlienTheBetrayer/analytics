import { Avatar } from "@/features/messages/components/conversations/display/parts/Avatar";
import { BottomButtons } from "@/features/messages/components/conversations/display/parts/BottomButtons";
import { LastMessage } from "@/features/messages/components/conversations/display/parts/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/parts/LastMessageDate";
import { Name } from "@/features/messages/components/conversations/display/parts/Name";
import { Pinned } from "@/features/messages/components/conversations/display/parts/Pinned";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ConversationDisplay = ({ data }: Props) => {
    const selectedConversation = useAppStore(
        (state) => state.selectedConversation,
    );
    const isSelected = selectedConversation === data.id;

    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! h-20! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={isSelected ? "/messages/" : `/messages/c/${data.id}`}
            >
                <Avatar data={data} />
                <Pinned data={data} />

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <Name data={data} />
                        <LastMessageDate data={data} />
                    </div>

                    <LastMessage data={data} />
                </div>
            </LinkButton>

            <BottomButtons
                type="regular"
                data={data}
            />
        </div>
    );
};
