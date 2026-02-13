import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoResults = () => {
    return (
        <AbsentData
            title={
                <>
                    No users <u>found</u>
                </>
            }
            description={
                <>
                    The <mark>query</mark> you have entered resulted in no users
                </>
            }
        />
    );
};
