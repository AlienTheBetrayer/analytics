"use client";

import { AlreadyLoggedIn } from "@/features/authentication/components/AlreadyLoggedIn";
import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { applicationLogin } from "@/query-api/calls/auth";
import { useQuery } from "@/query/core";

const LoginPage = () => {
    const { data: status } = useQuery({ key: ["status"] });

    // already logged in fallback
    if (status) {
        return (
            <main className="w-full flex flex-col items-center gap-8">
                <AlreadyLoggedIn />
            </main>
        );
    }

    return (
        <main className="w-full flex flex-col items-center gap-8">
            <div className="box flex flex-col gap-1 text-center w-full max-w-7xl">
                <h1>Authentication</h1>
                <p>
                    Sign in to your account to continue. If your account is
                    inactive for 7 days, you&apos;ll be automatically signed out
                    and asked to log in again to ensure your access remains
                    secure.
                </p>
            </div>
            <AuthenticationForm
                title="Logging in"
                button={{
                    text: "Log in",
                    tooltip: "Log in an existing account",
                }}
                onSubmit={async (username, password) => {
                    return await applicationLogin({ username, password });
                }}
            />
        </main>
    );
};

export default LoginPage;
