"use client";
import axios from "axios";
import { useEffect } from "react";
import { useSessionStore } from "./sessionStore";

export const SessionStoreWatcher = () => {
	const setIsLoggedIn = useSessionStore((state) => state.setIsLoggedIn);

	useEffect(() => {
		const check = async () => {
			// returns 200 if logged in, otherwise goes to the catch block
			try {
				const res = await axios.post("/api/auth/refresh");

				setIsLoggedIn({ role: res.data.role });
			} catch {
				setIsLoggedIn(false);
			}
		};

		check();
	}, [setIsLoggedIn]);

	return null;
};
