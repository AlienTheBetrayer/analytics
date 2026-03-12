"use client";

import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { applicationLogin } from "@/query-api/calls/auth";

const LoginPage = () => {
    return (
        <main className="w-full flex flex-col items-center gap-8">
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
