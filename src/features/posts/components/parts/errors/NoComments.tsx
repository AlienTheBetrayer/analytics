import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoComments = () => {
    return (
        <AbsentData
            className="m-0!"
            title={
                <>
                    <u>Absent</u> comments
                </>
            }
            description={
                <>
                    The post you are currently on does not have{" "}
                    <u>any comments</u> yet.
                </>
            }
        />
    );
};
