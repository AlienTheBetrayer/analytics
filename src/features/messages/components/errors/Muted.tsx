import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const Muted = () => {
    return (
        <AbsentData
            title={
                <>
                    Messages are <u>prohibited</u>
                </>
            }
            description={
                <>
                    You have been indefinitely muted and prohibited from sending
                    any messages, contact founders or admins!
                </>
            }
        />
    );
};
