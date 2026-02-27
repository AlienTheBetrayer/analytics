import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const AlreadyMember = () => {
    return (
        <AbsentData
            title={
                <>
                    <mark>Already</mark> a member!
                </>
            }
            description={
                <>
                    The conversation that this invitation leads to already has
                    you as a member!
                </>
            }
        />
    );
};
