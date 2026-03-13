import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const Realtime = () => {
    return (
        <BentoSection
            src="/server.svg"
            text="Realtime"
        >
            <LinkButton
                href="/messages"
                className="w-full p-2! max-w-48 mx-auto!"
            >
                <div className="w-1 h-1 rounded-full bg-red-2" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/send.svg"
                />
                Messages
            </LinkButton>

            <ul className="grid! grid-cols-3 gap-2 w-full max-w-64 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/send.svg"
                        text={"Messages"}
                    >
                        Messages are delivered instantly using real-time WebSocket connections
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--blue-3)"
                        src="/cubes.svg"
                        text={"Conversation"}
                    >
                        Conversation changes are reflected immediately across the application
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--orange-1)"
                        src="/server.svg"
                        text={"Membership"}
                    >
                        Membership data such as roles, permissions, and mute status updates in real time
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
