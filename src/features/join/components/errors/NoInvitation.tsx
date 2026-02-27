import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const NoInvitation = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Absent</u> invitation
                </>
            }
            description={
                <>
                    This invitation does not exist or has been <u>revoked</u>.
                    Ensure the URL is <mark>correct</mark>.
                </>
            }
        >
            <LinkButton
                className="w-full max-w-48"
                href={`/home`}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/cube.svg"
                />
                Home
            </LinkButton>
        </AbsentData>
    );
};
