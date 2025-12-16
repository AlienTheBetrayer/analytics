import axios from "axios";
import { type FormEvent, useCallback, useRef, useState } from "react";

export type AuthStatus = "success" | "failure" | null;

export const useAuth = () => {
	// states
	const [code, setCode] = useState<string | null>(null);
	const [status, setStatus] = useState<AuthStatus>(null);

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
					await axios.post("api/auth/login", { code });
					setStatus("success");
				} catch {
					setStatus("failure");
				}
			}
		},
		[code],
	);

	const onLogout = useCallback(() => {
		setStatus(null);
		setCode(null);
		try {
			axios.post("api/auth/logout");
		} catch {
			setStatus("failure");
		}
	}, []);

	return {
		code,
		formRef,
		status,
		onCodeChange,
		onFormSubmit,
		onLogout,
	};
};
