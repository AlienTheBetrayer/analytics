/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const CantRead = () => {
    return (
        <AbsentData
            title={
                <>
                    Messages are <u>prohibited</u>
                </>
            }
            description={
                <>
                    You have been indefinitely muted and prohibited from sending any messages, contact founders or
                    admins!
                </>
            }
        />
    );
};
