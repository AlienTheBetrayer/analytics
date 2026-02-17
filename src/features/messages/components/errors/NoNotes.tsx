import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoNotes = () => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2 w-9/12"
            title={
                <>
                    No notes <u>yet</u>
                </>
            }
            description={
                <>
                    This board has no elements in it. But you can{" "}
                    <mark>add</mark> them!
                </>
            }
        />
    );
};
