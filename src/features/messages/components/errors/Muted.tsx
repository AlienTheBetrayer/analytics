import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";

type Props = {
    muted_until: CacheAPIProtocol["conversations"]["data"][number]["membership"]["muted_until"];
};

export const Muted = ({ muted_until }: Props) => {
    return (
        <AbsentData
            title={
                <>
                    You are temporarily <u>muted</u>
                </>
            }
            description={
                <>
                    You have been temporarily muted and you will be able to talk
                    again {relativeTime(muted_until)}
                </>
            }
        />
    );
};
