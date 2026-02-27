import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const WrongURL = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Wrong</u> URL
                </>
            }
            description={
                <>
                    There is no ID in the URL. Re-enter the <mark>URL</mark> and
                    the error will be gone
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
