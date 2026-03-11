/** @format */

import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

type Props = {
    mutedString: string;
};

export const Muted = ({ mutedString }: Props) => {
    return (
        <AbsentData
            title={
                <>
                    You are temporarily <u>muted</u>
                </>
            }
            description={<>You have been temporarily muted and you will be able to talk again {mutedString}</>}
        />
    );
};
