import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";

export const SWR = () => {
    return (
        <BentoSection
            src="/download.svg"
            text="SWR"
        >
            <ul className="grid! grid-cols-2 gap-2 w-full max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--red-1)"
                        src="/download.svg"
                        text={"Fetching"}
                    >
                        Data fetching includes built-in loading states, simplifying promise handling and UI feedback
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/reload.svg"
                        text={"Revalidation"}
                    >
                        On remount or key change, cached data is shown while revalidating in the background for a
                        seamless UX
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
