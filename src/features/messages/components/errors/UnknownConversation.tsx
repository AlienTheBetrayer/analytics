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
                    Something went wrong... Try to <mark>reload</mark> this page
                </>
            }
        />
    );
};
