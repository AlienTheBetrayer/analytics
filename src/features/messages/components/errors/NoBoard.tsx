import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const NoBoard = () => {
    return (
        <AbsentData
            title={
                <>
                    This board is <u>absent</u>
                </>
            }
            description={
                <>
                    The board you have selected (at the URL) does <u>not</u>{" "}
                    exist, re-check the URL
                </>
            }
        >
            <LinkButton
                className="w-full"
                href="/messages/notes/board/"
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/back.svg"
                />
                Go back
            </LinkButton>
        </AbsentData>
    );
};
