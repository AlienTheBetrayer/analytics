import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoPreview = () => {
    return (
        <AbsentData
            title={
                <>
                    No preview <u>yet</u>
                </>
            }
            description={
                <>
                    You have <u>not typed</u> a single letter in the form, so
                    the preview is absent
                </>
            }
        />
    );
};
