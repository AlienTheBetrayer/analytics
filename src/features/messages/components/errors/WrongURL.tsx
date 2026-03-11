/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const WrongURL = () => {
    return (
        <AbsentData
            title={
                <>
                    The URL is <u>wrong</u>
                </>
            }
            description={
                <>
                    Re-enter the URL or click on a <mark>conversation</mark> to restore the URL to its original state
                </>
            }
        />
    );
};
