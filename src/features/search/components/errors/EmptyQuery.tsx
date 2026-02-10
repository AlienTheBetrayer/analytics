import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const EmptyQuery = () => {
    return (
        <AbsentData
            className="mt-8"
            title={
                <>
                    <u>Invalid</u> query
                </>
            }
            description={
                <>
                    The query you have prompted is <u>invalid</u>, prompt a{" "}
                    <mark>valid</mark> query, afterwards you might see the user
                    you may have been looking for
                </>
            }
        >
            <Tooltip
                text="Go back home"
                className="w-full"
            >
                <LinkButton
                    className="w-full"
                    href="/home"
                >
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/cube.svg"
                    />
                    Home
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
