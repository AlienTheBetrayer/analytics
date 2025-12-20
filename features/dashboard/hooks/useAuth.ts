import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { useSessionStore } from "@/zustand/sessionStore";
import axios from "axios";
import { useCallback, useRef, useState } from "react";

export type AuthStatus =
	| "registered"
	| "authenticated"
	| "incorrect credentials"
	| "incorrect length"
	| null;

export const useAuth = () => {
	// zustand
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
	const setIsLoggedIn = useSessionStore((state) => state.setIsLoggedIn);

	// states
	const [data, setData] = useState<{
		username: string | null;
		password: string | null;
	}>({
		username: null,
		password: null,
	});

	// statuses
	const [status, setStatus] = useState<AuthStatus>(null);
	const promiseStatus = usePromiseStatus();

	// refs
	const formRef = useRef<HTMLFormElement | null>(null);

	// user functions
	const onPasswordChange = useCallback((newPassword: string) => {
		setData((prev) => ({ ...prev, password: newPassword }));
	}, []);

	const onUsernameChange = useCallback((newUsername: string) => {
		setData((prev) => ({ ...prev, username: newUsername }));
	}, []);

	const onRegister = useCallback(async () => {
		if (formRef.current?.checkValidity()) {
			promiseStatus
				.wrap("register", async () => {
					await axios.post("api/auth/register", {
						username: data.username,
						password: data.password,
					});
					setStatus("registered");
				})
				.catch((e) => {
					// check code
					console.log(JSON.stringify(e));
					setStatus("incorrect credentials");
				});
		}
	}, [data, promiseStatus.wrap]);

	const onLogin = useCallback(async () => {
		if (formRef.current?.checkValidity()) {
			promiseStatus
				.wrap("login", async () => {
					await axios.post("api/auth/login", {
						username: data.username,
						password: data.password,
					});
					setStatus("authenticated");
				})
				.catch(() => {
					// check code
					setStatus("incorrect credentials");
				});
		}
	}, [data, promiseStatus.wrap]);

	const onLogout = useCallback(async () => {
		try {
			await axios.post("api/auth/logout");
		} catch {
			setStatus(null);
		}
	}, []);

	const clearData = useCallback(() => {
		setData({ username: null, password: null });
		setStatus(null);
	}, []);

	return {
		data,
		clearData,
		formRef,
		status,
		promiseStatus,
		onPasswordChange,
		onUsernameChange,
		onLogin,
		onRegister,
		onLogout,
	};
};
