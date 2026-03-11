/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoPermissions = () => {
    return (
        <AbsentData
            title={
                <>
                    You have no <u>permissions</u>
                </>
            }
            description={
                <>You are not allowed to view this conversation, please check your URL if it is the correct one</>
            }
        />
    );
};
