"use client";

import { AuthenticationForm } from "@/features/authentication/components/AuthenticationForm";
import { useRedirect } from "@/hooks/useRedirect";
import { useAppStore } from "@/zustand/store";

const LoginPage = () => {
	// zustand
	const status = useAppStore((state) => state.status);
	const login = useAppStore((state) => state.login);

	// redirecting to home if we're already logged in
	useRedirect(status && status.isLoggedIn === true, "/dashboard");

	return (
		<main className="w-full h-screen flex flex-col justify-center items-center dotted gap-16">
			<div className="flex flex-col gap-1 text-center max-w-lg">
				<h2>Authentication</h2>
				<p>
					Sign in to your account to continue. If your account is inactive for 7
					days, you'll be automatically signed out and asked to log in again to
					ensure your access remains secure.
				</p>
			</div>
			<AuthenticationForm
				title="Authentication"
				button={{ text: "Log in", tooltip: "Log in an existing account" }}
				onSubmit={async (username, password) => {
					return await login(username, password);
				}}
			/>
		</main>
	);
};

export default LoginPage;
