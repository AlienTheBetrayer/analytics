import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const NPM = () => {
    return (
        <BentoSection
            src="/npm.svg"
            text="NPM"
        >
            <ul className="grid grid-cols-2 w-full max-w-64 gap-2 mx-auto!">
                <li>
                    <LinkButton
                        href={"https://www.npmjs.com/package/@alienthebetrayer/analytics-sdk-core?activeTab=code"}
                        newTab
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/launch.svg"
                        />
                        Package
                    </LinkButton>
                </li>

                <li>
                    <LinkButton href="/dashboard">
                        <div className="w-1 h-1 rounded-full bg-blue-2" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/dashboard.svg"
                        />
                        Dashboard
                    </LinkButton>
                </li>
            </ul>

            <ul className="grid grid-cols-2 w-full max-w-36 gap-2 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-3)"
                        src="/npm.svg"
                        text="Data"
                    >
                        Data is transmitted to the dashboard from other applications via a custom NPM SDK
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-3)"
                        src="/security.svg"
                        text="View"
                    >
                        The dashboard is restricted and not accessible to regular users for viewing or editing
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
