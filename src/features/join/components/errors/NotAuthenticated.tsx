import { AbsentData } from "@/features/ui/absentdata/components/AbsentData";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const NotAuthenticated = () => {
    return (
        <AbsentData
            title={
                <>
                    Not <u>authenticated</u>
                </>
            }
            description={
                <>
                    In order to join this conversation you have to be logged in.
                </>
            }
        >
            <ul className="grid grid-cols-2 w-full max-w-64 gap-2">
                <li>
                    <LinkButton
                        className="w-full max-w-48"
                        href="/signup"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/plus.svg"
                        />
                        Sign up
                    </LinkButton>
                </li>

                <li>
                    <LinkButton
                        className="w-full max-w-48"
                        href="/login"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/auth.svg"
                        />
                        Log in
                    </LinkButton>
                </li>
            </ul>
        </AbsentData>
    );
};
