"use client";
import { AuthenticationForm } from "@/src/features/authentication/components/AuthenticationForm";
import { useRedirect } from "@/src/hooks/useRedirect";
import { useAppStore } from "@/src/zustand/store";

const RegisterPage = () => {
	// zustand
	const status = useAppStore((state) => state.status);
	const register = useAppStore((state) => state.register);

	// redirecting to home if we're already logged in
	useRedirect(status && status.isLoggedIn === true, "/dashboard");

	return (
		<main className="w-full h-screen flex flex-col justify-center items-center dotted gap-16">
			<div className="flex flex-col gap-1 text-center max-w-lg">
				<h2>Signing up</h2>
				<p>
					Create an account to get started. Your information is securely stored
					and used only to provide access to the platform and its features. Your
					account ensures protected, reliable access across sessions.
				</p>
			</div>
			<AuthenticationForm
				title="Account creation"
				button={{ text: "Register", tooltip: "Create a new account" }}
				onSubmit={async (username, password) => {
					return await register(username, password);
				}}
			/>
		</main>
	);
};

export default RegisterPage;
