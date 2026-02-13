import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NotSelected = () => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    <u>No</u> conversation / user selected
                </>
            }
            description={
                <>
                    <mark>Messages</mark> will appear here when you select any
                    conversation or go to someone&apos;s profile
                </>
            }
        />
    );
};
