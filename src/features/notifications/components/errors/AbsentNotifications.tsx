import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";
import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";

export const AbsentNotifications = () => {
    return (
        <AbsentData
            title={
                <>
                    <u>Absent</u> notifications
                </>
            }
            description={
                <>
                    Currently you have <u>no</u> notifications on the current
                    tab, <mark>interact</mark> with the application for them to
                    appear here
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
