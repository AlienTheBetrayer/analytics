import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { useLocalStore } from "@/zustand/localStore";

export const AlreadyLoggedIn = () => {
    // zustand state
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const logout = useAppStore((state) => state.logout);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    return (
        <>
            <div className="flex flex-col gap-1 text-center max-w-150">
                <h1>
                    Already <mark>authenticated!</mark>
                </h1>
                <p>
                    You&apos;re already authenticated. Your account is secure
                    and ready, and you can continue to your dashboard or any
                    active work.
                </p>
            </div>

            <div className="box max-w-400">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="text-center  text-5! whitespace-nowrap">
                            Authentication is <mark>done</mark>
                        </span>
                        <span className="text-center">
                            You can now proceed to your dashboard / profile and
                            all its features with your current access
                        </span>

                        <LinkButton href="/profile">
                            <Image
                                alt=""
                                src="/account.svg"
                                width={16}
                                height={16}
                            />
                            Go to profile
                        </LinkButton>

                        <LinkButton href="/dashboard">
                            <Image
                                alt=""
                                src="/dashboard.svg"
                                width={16}
                                height={16}
                            />
                            Go to dashboard
                        </LinkButton>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-center whitespace-nowrap">
                            <u>Logging</u> out
                        </span>
                        <span className="text-center">
                            However, if your goal was to log yourself out, you
                            can also do it here, afterwards you&apos;ll see the
                            authentication form again
                        </span>

                        <Button
                            className="w-full"
                            onClick={() => {
                                logout();
                                setVisibleProfile(undefined);
                            }}
                        >
                            {promiseStatus(promises.logout)}
                            <Image
                                alt=""
                                src="/auth.svg"
                                width={16}
                                height={16}
                            />
                            Log me out
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};
