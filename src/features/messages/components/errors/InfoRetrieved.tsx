import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const InfoRetrieved = () => {
    return (
        <AbsentData
            title={
                <>
                    Conversation has <u>yet</u> to be created
                </>
            }
            description={
                <>
                    This modal will have <mark>more</mark> information once you
                    initiate this conversation!
                </>
            }
        />
    );
};
