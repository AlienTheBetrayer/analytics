import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const WrongURL = () => {
    return (
        <AbsentData
            className="absolute left-1/2 top-1/2 -translate-1/2"
            title={
                <>
                    The URL is <u>wrong</u>
                </>
            }
            description={
                <>
                    Re-enter the URL or click on a <mark>conversation</mark> to
                    restore the URL to its original state
                </>
            }
        />
    );
};
