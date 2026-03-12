import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { applicationLogout } from "@/query-api/calls/auth";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    hide?: () => void;
};

export const AuthElements = ({ hide }: Props) => {
    // status
    const { data: status } = useQuery({ key: ["status"] });

    // message bxoes
    const logoutBox = useMessageBox();

    return (
        <div className="relative box gap-4! p-4! acrylic h-full w-full items-center">
            {logoutBox.render({
                children: "You will be logged out of your account!",
                onSelect: (res) => {
                    if (res === "yes") {
                        wrapPromise("logout", () => {
                            return applicationLogout();
                        });
                        hide?.();
                    }
                },
            })}

            <div className="flex flex-col items-center">
                <span className="relative flex gap-1 items-center">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/server.svg"
                    />
                </span>
                <span>Authentication</span>
            </div>

            <ul className="grid grid-cols-3 gap-2 w-full max-w-81">
                <li>
                    <LinkButton
                        href="/signup"
                        className="box w-full aspect-square p-2! rounded-4xl!"
                        onClick={hide}
                    >
                        <span className="flex items-center">
                            <div className="w-1 h-1 rounded-full bg-blue-3" />
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

                <li>
                    <LinkButton
                        href="/login"
                        className="box w-full aspect-square p-2! rounded-4xl!"
                        onClick={hide}
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
                    <Button
                        isEnabled={!!status}
                        className="box w-full aspect-square p-2! rounded-4xl!"
                        onClick={logoutBox.show}
                    >
                        <span className="flex items-center">
                            <PromiseState state="logout" />
                            <div className="w-1 h-1 rounded-full bg-red-1" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                        </span>
                        Log out
                    </Button>
                </li>
            </ul>
        </div>
    );
};
