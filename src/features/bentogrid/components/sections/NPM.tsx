import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";

export const NPM = () => {
    return (
        <BentoSection
            src="/npm.svg"
            text="NPM"
        >
            <LinkButton
                href={"https://www.npmjs.com/package/@alienthebetrayer/analytics-sdk-core?activeTab=code"}
                newTab
            ></LinkButton>
        </BentoSection>
    );
};
