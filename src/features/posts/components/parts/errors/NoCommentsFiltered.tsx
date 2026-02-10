import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoCommentsFiltered = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Filtered</u> out everything
                </>
            }
            description={
                <>
                    Your filter query has resulted in <u>no comments</u>, make
                    sure to re-check your filter.
                </>
            }
        />
    );
};
