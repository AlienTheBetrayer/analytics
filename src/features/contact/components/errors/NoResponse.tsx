import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const NoResponse = () => {
    return (
        <AbsentData
            className="mt-0!"
            title={
                <>
                    Please <u>wait</u> for our response
                </>
            }
            description={
                <>
                    Thank you for your feedback! We will get back to you soon
                    and you will see a response <mark>here</mark>
                </>
            }
        />
    );
};
