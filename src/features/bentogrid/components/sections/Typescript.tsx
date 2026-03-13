import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";

export const Typescript = () => {
    return (
        <BentoSection
            src="/type.svg"
            text="Typescript"
        >
            <ul className="grid! grid-cols-2 gap-2 w-full max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-3)"
                        src="/type.svg"
                        text={"Types"}
                    >
                        The app is fully typed, ensuring consistency across endpoints, tables, and response codes
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-1)"
                        src="/cubes.svg"
                        text={"API"}
                    >
                        All data, including useQuery() results and API, is strongly typed for maximum reliability
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
