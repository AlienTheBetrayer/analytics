"use client";

import { AlreadyLoggedIn } from "@/features/authentication/components/AlreadyLoggedIn";
import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { applicationSignup } from "@/query-api/calls/auth";
import { useQuery } from "@/query/core";

const RegisterPage = () => {
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
                <h1>Signing up</h1>
                <p>
                    Create an account to get started. Your information is
                    securely stored and used only to provide access to the
                    platform and its features. Your account ensures protected,
                    reliable access across sessions.
                </p>
            </div>
            <AuthenticationForm
                type="register"
                title="Account creation"
                button={{
                    text: "Register",
                    tooltip: "Create a new account",
                }}
                onSubmit={async (username, password) => {
                    return await applicationSignup({ username, password });
                }}
            />
        </main>
    );
};

export default RegisterPage;
