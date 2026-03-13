import { BentoSection } from "@/features/bentogrid/components/parts/BentoSection";
import { InfoTooltip } from "@/features/bentogrid/components/parts/InfoTooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { useQuery } from "@/query/core";
import Image from "next/image";

export const Permissions = () => {
    const { data: status, isLoading } = useQuery({ key: ["status"] });

    return (
        <BentoSection
            src="/security.svg"
            text="Permissions"
            className="gap-4"
        >
            {status ?
                <div className="flex flex-col items-center gap-1">
                    <LinkButton
                        href="/profile"
                        className="w-full p-2! max-w-32 mx-auto!"
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
            :   <ul className="grid grid-cols-2 gap-2 w-full max-w-32 lg:max-w-42 mx-auto! relative">
                    {isLoading ?
                        <>
                            <li className="box w-full loading rounded-4xl! col-span-2" />
                            <li>
                                <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
                            </li>
                        </>
                    :   <>
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
                        </>
                    }
                </ul>
            }

            <ul className="grid! grid-cols-2 gap-2 w-full max-w-36 lg:max-w-48 mx-auto!">
                <li>
                    <InfoTooltip
                        color="var(--blue-3)"
                        src="/cube.svg"
                        text={"Roles"}
                    >
                        Roles are stored in JWT tokens and determine the UI for each user
                    </InfoTooltip>
                </li>

                <li>
                    <InfoTooltip
                        color="var(--orange-1)"
                        src="/settings.svg"
                        text={"API"}
                    >
                        Primary security is enforced at the API layer to prevent unauthorized access
                    </InfoTooltip>
                </li>
            </ul>
        </BentoSection>
    );
};
