import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useQuery } from "@/query/core";
import Image from "next/image";

export const Permissions = () => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <BentoSection
            src="/security.svg"
            text="Permissions"
        >
            {status ?
                <div className="box p-4! gap-4! bg-bg-2! items-center">
                    <span className="flex items-center gap-1">
                        <span>Your role —</span>
                        <div className="w-1 h-1 bg-blue-1 rounded-full" />
                        <span>{status?.role}</span>
                    </span>

                    <LinkButton
                        href="/profile"
                        className="w-full p-2! not-hover:bg-bg-1!"
                    >
                        <div className="w-1 h-1 rounded-full bg-blue-3" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/launch.svg"
                        />
                        Profile
                    </LinkButton>
                </div>
            :   <ul className="grid grid-cols-2 gap-1 w-full max-w-42">
                    <li>
                        <LinkButton
                            href="/login"
                            className="w-full flex-col not-hover:bg-bg-1! aspect-square truncate rounded-4xl!"
                        >
                            <span className="flex items-center">
                                <div className="w-1 h-1 rounded-full bg-blue-1" />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/send.svg"
                                />
                            </span>
                            Log in
                        </LinkButton>
                    </li>

                    <li>
                        <LinkButton
                            href="/signup"
                            className="w-full flex-col not-hover:bg-bg-1! aspect-square truncate rounded-4xl!"
                        >
                            <span className="flex items-center">
                                <div className="w-1 h-1 rounded-full bg-orange-3" />
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                            </span>
                            Sign up
                        </LinkButton>
                    </li>
                </ul>
            }

            <ul className="box p-4! gap-1! bg-bg-2! grid! grid-cols-3">
                <li>
                    <InfoTooltip
                        color="var(--blue-3)"
                        src="/cube.svg"
                        text={"Roles are stored in JWT tokens and determine the UI for each user"}
                    >
                        Roles
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--orange-1)"
                        src="/settings.svg"
                        text={"Primary security is enforced at the API layer to prevent unauthorized access"}
                    >
                        API
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--red-1)"
                        src="/delete.svg"
                        text={"Additional security features allow users to revoke active sessions on other devices"}
                    >
                        Sessions
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
