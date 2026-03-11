/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const YouAreFounder = () => {
    return (
        <AbsentData
            title={
                <>
                    You are a <mark>founder</mark>
                </>
            }
            description={
                <>You are able to assign other users roles, mute them, kick, change their permissions, anything!</>
            }
        />
    );
};
