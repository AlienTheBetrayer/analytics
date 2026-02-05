import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoPreview = () => {
    return (
        <AbsentData
            className="mt-0!"
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
