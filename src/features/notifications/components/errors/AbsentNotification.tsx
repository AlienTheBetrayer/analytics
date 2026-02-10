import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const AbsentNotification = () => {
    return (
        <AbsentData
            className="mt-8"
            title={
                <>
                    <u>Absent</u> notification
                </>
            }
            description={
                <>
                    The notification you have selected is, for some reason,
                    <u>absent</u>. Re-check the <mark>URL</mark> or if you even
                    have any notifications in the first place.
                </>
            }
        >
            <Tooltip
                text="Emulate a synthetic event"
                className="w-full"
            >
                <LinkButton
                    href="/notifications/emulate"
                    className="w-full"
                >
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/emulate.svg"
                    />
                    Emulate
                </LinkButton>
            </Tooltip>
        </AbsentData>
    );
};
