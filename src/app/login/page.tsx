"use client";

import { AlreadyLoggedIn } from "@/features/authentication/components/AlreadyLoggedIn";
import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { useLocalStore } from "@/zustand/localStore";
import { useAppStore } from "@/zustand/store";

const LoginPage = () => {
    // zustand
    const status = useAppStore((state) => state.status);

    // zustand functions
    const login = useAppStore((state) => state.login);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    return (
        <main className="w-full flex flex-col items-center gap-8">
            {status ? (
                <AlreadyLoggedIn />
            ) : (
                <>
                    <div className="box flex flex-col gap-1 text-center w-full max-w-6xl">
                        <h1>Authentication</h1>
                        <p>
                            Sign in to your account to continue. If your account
                            is inactive for 7 days, you&apos;ll be automatically
                            signed out and asked to log in again to ensure your
                            access remains secure.
                        </p>
                    </div>
                    <AuthenticationForm
                        title="Logging in"
                        button={{
                            text: "Log in",
                            tooltip: "Log in an existing account",
                        }}
                        onSubmit={async (username, password) => {
                            const data = await login(username, password);

                            if (data?.user) {
                                setVisibleProfile({
                                    username: data.user.username,
                                    avatar_url: data.user.profile.avatar_url,
                                    color: data.user.profile.color,
                                });
                            }

                            return data;
                        }}
                    />
                </>
            )}
        </main>
    );
};

export default LoginPage;
