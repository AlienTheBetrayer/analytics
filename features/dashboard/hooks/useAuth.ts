import { useSessionStore } from "@/zustand/sessionStore";
import axios from "axios";
import {
	type FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export type AuthStatus = "success" | "failure" | null;

export const useAuth = () => {
	// zustand
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
	const setIsLoggedIn = useSessionStore((state) => state.setIsLoggedIn);

	// states
	const [code, setCode] = useState<string | null>(null);
	const [status, setStatus] = useState<AuthStatus>(
		isLoggedIn === true ? "success" : null,
	);
	const [isLoading, setIsLoading] = useState<{
		signIn?: boolean;
		logOut?: boolean;
	}>();

	useEffect(() => {
		setIsLoggedIn(status === "success");
	}, [status, setIsLoggedIn]);

	// refs
	const formRef = useRef<HTMLFormElement | null>(null);

	// user functions
	const onCodeChange = useCallback((newCode: string) => {
		setCode(newCode);
	}, []);

	const onFormSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (formRef.current?.checkValidity()) {
				try {
					setIsLoading({ signIn: true });
					await axios.post("api/auth/login", { code });
					setStatus("success");
				} catch {
					setStatus("failure");
				} finally {
					setTimeout(() => setIsLoading({ signIn: false }), 300);
				}
			}
		},
		[code],
	);

	const onLogout = useCallback(async () => {
		setStatus(null);
		setCode(null);
		try {
			setIsLoading({ logOut: true });
			await axios.post("api/auth/logout");
		} catch {
			setStatus("failure");
		} finally {
			setTimeout(() => setIsLoading({ logOut: false }), 300);
		}
	}, []);

	return {
		code,
		isLoading,
		formRef,
		status,
		onCodeChange,
		onFormSubmit,
		onLogout,
	};
};
