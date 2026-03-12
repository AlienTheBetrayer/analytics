"use client";

import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { applicationSignup } from "@/query-api/calls/auth";

const RegisterPage = () => {
    return (
        <main className="w-full flex flex-col items-center gap-8">
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
