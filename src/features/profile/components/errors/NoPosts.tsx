import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoPosts = () => {
    return (
        <AbsentData
            className="mt-8"
            title={
                <>
                    <u>Absent</u> posts
                </>
            }
            description={
                <>
                    The user you are currently viewing does <u>not</u> have any
                    posts yet.
                </>
            }
        />
    );
};
