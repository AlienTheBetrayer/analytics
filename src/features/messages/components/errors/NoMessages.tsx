import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoMessages = () => {
    return (
        <AbsentData
            title={
                <>
                    No messages <u>yet</u>
                </>
            }
            description={
                <>
                    Be the first one to send the <mark>message</mark> and start
                    an interesting conversation!
                </>
            }
        />
    );
};
