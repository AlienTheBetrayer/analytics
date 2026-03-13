import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";

export const UseQuery = () => {
    return (
        <BentoSection
            src="/auth.svg"
            text="useQuery()"
        >
            <ul className="grid! grid-cols-2 gap-2 w-full max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/archive.svg"
                        text={"Revamp"}
                    >
                        A custom data-fetching system inspired by TanStack Query with strong type enforcement
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--blue-1)"
                        src="/server.svg"
                        text={"Caching"}
                    >
                        All data is key-cached and accessed in O(1) time, automatically propagated to JSX
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-3)"
                        src="/link.svg"
                        text={"SWR"}
                    >
                        The SWR pattern is implemented to display cached data while revalidating in the background
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--green-1)"
                        src="/arrow.svg"
                        text={"Promises"}
                    >
                        Automatic promise deduplication and race condition handling ensure efficient data fetching
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
