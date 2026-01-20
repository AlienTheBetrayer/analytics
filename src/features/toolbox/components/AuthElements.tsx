import { CloseButton } from "@/features/ui/closebutton/components/CloseButton";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

type Props = {
    hide: () => void;
};

export const AuthElements = ({ hide }: Props) => {
    return (
        <div className="relative box h-full min-w-64">
            <CloseButton hide={hide} />

            <div className="flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-1 items-center">
                    <div className="relative flex gap-1">
                        <Image
                            width={16}
                            height={16}
                            alt=""
                            src="/server.svg"
                        />
                        <span>Authentication</span>
                    </div>
                    <p>Choose your path!</p>
                </div>

                <hr />

                <div className="flex flex-col gap-1">
                    <LinkButton
                        href="/signup"
                        className="w-full"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/pencil.svg"
                        />
                        Sign up
                    </LinkButton>

                    <LinkButton
                        href="/login"
                        className="w-full"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/security.svg"
                        />
                        Log in
                    </LinkButton>
                </div>
            </div>
        </div>
    );
};
