import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["invitations"]["data"][number];
};

export const InviteDisplay = ({ data }: Props) => {
    return (
        <div className="box p-3! items-center! flex-row!">
            {data.image_url ? (
                <Image
                    alt=""
                    width={256}
                    height={256}
                    src={data.image_url}
                    className="w-12! h-12! rounded-full invert-0!"
                />
            ) : (
                <div className="w-12 h-12 loading rounded-full" />
            )}

            
        </div>
    );
};
