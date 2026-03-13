import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";

export const JWT = () => {
    return (
        <BentoSection
            src="/auth.svg"
            text="JWT"
        >
            <ul className="grid! grid-cols-3 gap-2 w-full max-w-64 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/arrow.svg"
                        text={"Access"}
                    >
                        The application uses short-lived access tokens to securely authorize all API requests
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--orange-3)"
                        src="/arrow.svg"
                        text={"Refresh"}
                    >
                        Refresh tokens are implemented to allow secure session renewal without requiring users to log in
                        again
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-1)"
                        src="/delete.svg"
                        text={"Sessions"}
                    >
                        Additional security features allow users to revoke active sessions on other devices
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
