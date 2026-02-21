import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const LoadingMessages = () => {
    return (
        <AbsentData
            title={
                <>
                    Messages are <mark>loading</mark>...
                </>
            }
            description={
                <>
                    Please wait while your messages in this conversations are
                    loading!
                </>
            }
        />
    );
};
