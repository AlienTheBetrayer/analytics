import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { useSessionStore } from "@/zustand/sessionStore";
import axios from "axios";
import { useCallback, useState } from "react";

export type AuthStatus = {
	message: string;
	ok: boolean;
	registerRedirect?: boolean;
} | null;

export const useAuth = () => {
	// zustand
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

	// user functions
	const onPasswordChange = useCallback((newPassword: string) => {
		setData((prev) => ({ ...prev, password: newPassword }));
	}, []);

	const onUsernameChange = useCallback((newUsername: string) => {
		setData((prev) => ({ ...prev, username: newUsername }));
	}, []);

	const onRegister = useCallback(async () => {
		promiseStatus
			.wrap("register", async () => {
				await axios.post("api/auth/register", {
					username: data.username,
					password: data.password,
				});
				setStatus({ message: "Registered!", ok: true, registerRedirect: true });
			})
			.catch((e) => {
				const message = axios.isAxiosError(e)
					? (e.response?.data.error ?? "Unknown")
					: "Unknown";
				setStatus({ message, ok: false });
			});
	}, [data, promiseStatus.wrap]);

	const onLogin = useCallback(async () => {
		promiseStatus
			.wrap("login", async () => {
				const res = await axios.post("api/auth/login", {
					username: data.username,
					password: data.password,
				});
				setStatus({ message: "Authenticated!", ok: true });
				setIsLoggedIn({ role: res.data.role });
			})
			.catch((e) => {
				const message = axios.isAxiosError(e)
					? (e.response?.data.error ?? "Unknown")
					: "Unknown";
				setStatus({ message, ok: false });
			});
	}, [data, promiseStatus.wrap, setIsLoggedIn]);

	const onLogout = useCallback(async () => {
		try {
			await axios.post("api/auth/logout");
			setIsLoggedIn(false);
		} catch {
			setStatus(null);
		}
	}, [setIsLoggedIn]);

	const clearData = useCallback(() => {
		setData({ username: null, password: null });
		setStatus(null);
	}, []);

	return {
		data,
		clearData,
		status,
		promiseStatus,
		onPasswordChange,
		onUsernameChange,
		onLogin,
		onRegister,
		onLogout,
	};
};
