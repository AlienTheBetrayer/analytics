import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoMessages = () => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
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
