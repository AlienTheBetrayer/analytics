import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoFriends = () => {
    return (
        <AbsentData
            title={
                <>
                    No friends <u>found</u>
                </>
            }
            description={
                <>
                    Your account has currently got zero <mark>friends</mark>
                </>
            }
        />
    );
};
