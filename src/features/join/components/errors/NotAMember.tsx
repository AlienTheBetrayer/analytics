import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NotAMember = () => {
    return (
        <AbsentData
            title={
                <>
                    <mark>Join</mark> this conversation!
                </>
            }
            description={
                <>
                    You are not in the conversation yet. However, you can click
                    the button below and you will automatically join it.
                </>
            }
        />
    );
};
