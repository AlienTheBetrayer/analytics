/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const YouAreAdmin = () => {
    return (
        <AbsentData
            title={
                <>
                    You are an <mark>admin</mark>
                </>
            }
            description={<>Now you are able to administrate this conversation</>}
        />
    );
};
