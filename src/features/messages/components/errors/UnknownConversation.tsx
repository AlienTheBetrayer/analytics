import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const UnknownConversation = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Unknown</u> conversation
                </>
            }
            description={
                <>
                    You either have not loaded the conversation or something went wrong. Try to <mark>reload</mark> this page
                </>
            }
        />
    );
};
