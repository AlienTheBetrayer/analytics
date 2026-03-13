import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";

export const Zustand = () => {
    return (
        <BentoSection
            src="/social.svg"
            text="Zustand"
        >
            <ul className="grid! grid-cols-2 gap-2 w-full max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--red-1)"
                        src="/menu.svg"
                        text={"Synced"}
                    >
                        Essential data is synchronized with global state and accessed via selectors to minimize
                        unnecessary re-renders
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/social.svg"
                        text={"Three"}
                    >
                        The application utilizes in-memory state, localStorage, and sessionStorage for persistent
                        client-side data
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
