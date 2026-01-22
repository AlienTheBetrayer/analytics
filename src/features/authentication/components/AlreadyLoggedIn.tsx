import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { useLocalStore } from "@/zustand/localStore";
import { PromiseStatus } from "@/features/ui/promisestatus/components/PromiseStatus";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { useState } from "react";

export const AlreadyLoggedIn = () => {
    // zustand state
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);
    const logout = useAppStore((state) => state.logout);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // react states
    const [isLogoutEnabled, setIsLogoutEnabled] = useState<boolean>(false);

    // safe fallback
    if (!status) {
        return null;
    }

    return (
        <>
            <div className="box w-full max-w-7xl flex flex-col items-center gap-2 justify-center text-center">
                <h1>
                    Already <mark>authenticated!</mark>
                </h1>
                <p>
                    You are already authenticated and signed in successfully.
                    Your account is fully secured and ready for use, giving you
                    uninterrupted access to your dashboard, posts, messages,
                    profile, and friends. You may continue where you left off,
                    manage your account, or explore any active conversations and
                    content at your convenience.
                </p>
            </div>

            <ul className="box w-full max-w-7xl grid! lg:grid-cols-3 gap-16! lg:gap-8!">
                <li className="flex flex-col gap-2">
                    <aside className="flex items-center gap-1 justify-center text-center">
                        <div className="w-1 h-1 rounded-full bg-blue-3" />
                        <span>Miscellaneous</span>
                    </aside>

                    <hr className="my-2" />

                    <ul className="flex flex-col gap-2">
                        <li>
                            <LinkButton href="/home">
                                <Image
                                    alt=""
                                    src="/cube.svg"
                                    width={16}
                                    height={16}
                                />
                                Home
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton href="/contact">
                                <Image
                                    alt=""
                                    src="/phone.svg"
                                    width={16}
                                    height={16}
                                />
                                Contact
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton href="/notifications">
                                <Image
                                    alt=""
                                    src="/notification.svg"
                                    width={16}
                                    height={16}
                                />
                                Notifications
                            </LinkButton>
                        </li>
                    </ul>
                </li>

                <li className="flex flex-col gap-2">
                    <aside className="flex items-center gap-1 justify-center text-center">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <span>Account</span>
                    </aside>

                    <hr className="my-2" />

                    <ul className="flex flex-col gap-2">
                        <li>
                            <LinkButton href="/profile">
                                <Image
                                    alt=""
                                    src="/account.svg"
                                    width={16}
                                    height={16}
                                />
                                Profile
                            </LinkButton>
                        </li>

                        <li className="grid grid-cols-[1fr_auto_1fr] gap-1">
                            <LinkButton href="/posts">
                                <Image
                                    alt=""
                                    src="/book.svg"
                                    width={16}
                                    height={16}
                                />
                                View posts
                            </LinkButton>

                            <hr className="w-px! h-1/2! self-center" />

                            <LinkButton href="/post/create">
                                <Image
                                    alt=""
                                    src="/cubeadd.svg"
                                    width={16}
                                    height={16}
                                />
                                Create a post
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton
                                href={`/profile/${status.username}/friends`}
                            >
                                <Image
                                    alt=""
                                    src="/notification.svg"
                                    width={16}
                                    height={16}
                                />
                                Friends
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton href="/notifications">
                                <Image
                                    alt=""
                                    src="/notification.svg"
                                    width={16}
                                    height={16}
                                />
                                Messages
                            </LinkButton>
                        </li>

                        <li className="flex gap-1">
                            <Checkbox
                                aria-label="enable logout"
                                className="w-fit! rounded-full! aspect-square"
                                value={isLogoutEnabled}
                                onToggle={(flag) => setIsLogoutEnabled(flag)}
                            />

                            <hr className="w-px! h-1/2! self-center" />

                            <Button
                                isEnabled={isLogoutEnabled}
                                className="w-full"
                                onClick={() => {
                                    logout();
                                    setVisibleProfile(undefined);
                                }}
                            >
                                <PromiseStatus status={promises.logout} />
                                <Image
                                    alt=""
                                    src="/auth.svg"
                                    width={16}
                                    height={16}
                                />
                                Log me out
                            </Button>
                        </li>
                    </ul>
                </li>

                <li className="flex flex-col gap-2">
                    <aside className="flex items-center gap-1 justify-center text-center">
                        <div className="w-1 h-1 rounded-full bg-blue-2" />
                        <span>Dashboard</span>
                    </aside>

                    <hr className="my-2" />

                    <ul className="flex flex-col gap-2">
                        <li>
                            <LinkButton href="/dashboard">
                                <Image
                                    alt=""
                                    src="/dashboard.svg"
                                    width={16}
                                    height={16}
                                />
                                Dashboard
                            </LinkButton>
                        </li>

                        <li>
                            <LinkButton href="/emulate">
                                <Image
                                    alt=""
                                    src="/emulate.svg"
                                    width={16}
                                    height={16}
                                />
                                Emulate events
                            </LinkButton>
                        </li>
                    </ul>
                </li>
            </ul>
        </>
    );
};
