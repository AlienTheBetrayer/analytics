import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "../ProfileImage";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";

type Props = {
    data: { profile: Profile; user: User };
};

export const Security = ({ data }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const sessions = useAppStore((state) => state.sessions);
    const status = useAppStore((state) => state.status);

    // zustand functions
    const logout = useAppStore((state) => state.logout);
    const updateUser = useAppStore((state) => state.updateUser);
    const deleteUser = useAppStore((state) => state.deleteUser);
    const getSessions = useAppStore((state) => state.getSessions);
    const terminateSessions = useAppStore((state) => state.terminateSessions);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // fetching sessions
    useEffect(() => {
        getSessions({ user_id: data.user.id });
    }, [getSessions, data.user]);

    // states
    const [password, setPassword] = useState<string>("");

    // message boxes
    const deleteMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to delete your account data forever!"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    deleteUser(data.user.id);
                    if (data.user.id === status?.id) {
                        logout();
                        setVisibleProfile(undefined);
                        redirect("/home");
                    }
                }
            }}
        />
    ));

    // ui sessions
    const currentSessions = useMemo(() => {
        if (!sessions[data.user.id]?.length || !status) {
            return undefined;
        }

        return [...sessions[data.user.id].sort((a) => (a.isCurrent ? -1 : 1))];
    }, [sessions, data, status]);

    const terminateMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="All your other sessions will be terminated."
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    // no sessions (ensuring safety + types)
                    if (!currentSessions?.length) {
                        return;
                    }

                    const notCurrent = currentSessions
                        ?.filter((s) => !s.isCurrent)
                        .map((s) => s.id);

                    // if by some accident there's no current sessions
                    if (notCurrent.length === currentSessions.length) {
                        return;
                    }

                    terminateSessions({
                        user_id: data.user.id,
                        ids: notCurrent,
                    });
                }
            }}
        />
    ));

    return (
        <div className="flex flex-col gap-4 p-8 w-full">
            {deleteMessageBox.render()}
            {terminateMessageBox.render()}

            <div className="flex flex-col gap-2 items-center">
                <span className="text-foreground-2! text-5!">
                    <mark>{data.user.username}</mark>
                    &apos;s profile
                </span>
                <span>Security & Authentication</span>
            </div>

            <hr />
            <div className="flex flex-col md:flex-row gap-4 grow w-full">
                <div className="flex flex-col items-center gap-2 w-full md:max-w-96">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />

                    <div className="flex items-center gap-1">
                        <Image
                            width={20}
                            height={20}
                            alt=""
                            src="/privacy.svg"
                        />
                        <span className="text-foreground-5!">
                            {data.user.role[0].toUpperCase() +
                                data.user.role.substring(1)}
                        </span>
                    </div>

                    <Tooltip text="Log yourself out">
                        <Button
                            onClick={() => {
                                logout();
                                setVisibleProfile(undefined);
                            }}
                        >
                            {promiseStatus(promises.logout)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/auth.svg"
                            />
                            Log out
                        </Button>
                    </Tooltip>
                </div>

                <hr className="sm:w-px! sm:h-full" />
                <div className="flex flex-col gap-2 h-full w-full grow">
                    <form
                        className="flex flex-col gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateUser({
                                id: data.user.id,
                                data: { password },
                            });
                        }}
                    >
                        <label
                            htmlFor="bio"
                            className="flex items-center"
                        >
                            <b>Password</b>
                            <small className="ml-auto text-ellipsis-left">
                                (a new strong password)
                            </small>
                        </label>

                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e)}
                            placeholder="at least 6 characters"
                            minLength={6}
                            required
                        />

                        <hr className="mt-auto" />

                        <Tooltip
                            className="w-full"
                            text="Change your password"
                        >
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                {promiseStatus(promises.updateUser)}
                                <Image
                                    src="/send.svg"
                                    width={20}
                                    height={20}
                                    alt=""
                                />
                                Apply changes
                            </Button>
                        </Tooltip>
                    </form>

                    <hr />
                    <span className="flex items-center gap-2">
                        <b>Sessions</b>
                        <Tooltip
                            text="Re-load visible sessions"
                            direction="top"
                            disabledPointer
                        >
                            <Button
                                className="p-0!"
                                onClick={() => {
                                    getSessions({
                                        user_id: data.user.id,
                                        caching: false,
                                        promiseKey: "sessionsReload",
                                    });
                                }}
                            >
                                {promises.sessionsReload === "pending" ? (
                                    <Spinner />
                                ) : (
                                    <Image
                                        src="/reload.svg"
                                        width={16}
                                        height={16}
                                        alt="refresh"
                                    />
                                )}
                            </Button>
                        </Tooltip>
                        <small className="ml-auto text-ellipsis-left">
                            (all your logged in accounts)
                        </small>
                    </span>

                    <ul
                        className="flex flex-col overflow-y-auto h-full max-h-42 scheme-dark gap-px"
                        style={{
                            scrollbarWidth: "thin",
                        }}
                    >
                        {currentSessions ? (
                            currentSessions.map((token) => (
                                <React.Fragment key={token.id}>
                                    <li
                                        className={`flex gap-1 items-center rounded-2xl p-2! ${token.isCurrent ? "border border-blue-2" : ""}`}
                                    >
                                        {token.isCurrent ? (
                                            <>
                                                <Image
                                                    alt=""
                                                    width={20}
                                                    height={20}
                                                    src="/privacy.svg"
                                                />
                                                <span>Ongoing session</span>
                                            </>
                                        ) : (
                                            <span className="truncate">
                                                {token.id}
                                            </span>
                                        )}

                                        <Tooltip
                                            className="ml-auto"
                                            direction="top"
                                            text="Log out & delete this session"
                                            isEnabled={!token.isCurrent}
                                        >
                                            <Button
                                                isEnabled={!token.isCurrent}
                                                onClick={async () => {
                                                    terminateSessions({
                                                        ids: [token.id],
                                                        user_id: data.user.id,
                                                        promiseKey: `terminateSessions_${token.id}`,
                                                    });
                                                }}
                                            >
                                                {promiseStatus(
                                                    promises[
                                                        `terminateSessions_${token.id}`
                                                    ]
                                                )}
                                                <Image
                                                    src="/cross.svg"
                                                    width={16}
                                                    height={16}
                                                    alt=""
                                                />
                                                Terminate
                                            </Button>
                                        </Tooltip>
                                    </li>
                                    <hr className="w-4/5! mx-auto" />
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="flex flex-col gap-1 m-auto items-center">
                                {promises.getSessions === "pending" ||
                                promises.sessionsReload === "pending" ? (
                                    <Spinner
                                        width={24}
                                        height={24}
                                    />
                                ) : (
                                    <span>No sessions</span>
                                )}
                            </div>
                        )}
                    </ul>

                    <hr className="mt-auto" />
                    <Tooltip
                        text="Keep only this session logged in"
                        direction="bottom"
                        className="w-full"
                        disabledPointer
                    >
                        <Button
                            className="w-full"
                            onClick={() => {
                                terminateMessageBox.show();
                            }}
                        >
                            {promiseStatus(promises.terminateSessions)}
                            <Image
                                src="/auth.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Terminate other sessions
                        </Button>
                    </Tooltip>

                    <Tooltip
                        text="Wipe your account data"
                        direction="bottom"
                        className="w-full"
                        disabledPointer
                    >
                        <Button
                            className="w-full"
                            onClick={() => {
                                deleteMessageBox.show();
                            }}
                        >
                            {promises.delete === "pending" && <Spinner />}
                            <Image
                                src="/delete.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Delete account
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
