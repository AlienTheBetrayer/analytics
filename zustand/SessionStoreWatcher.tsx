"use client";
import axios from "axios";
import { useEffect } from "react";
import { useSessionStore } from "./localStore";

export const SessionStoreWatcher = () => {
	const setIsLoggedIn = useSessionStore((state) => state.setIsLoggedIn);

	useEffect(() => {
		const check = async () => {
			// returns 200 if logged in, otherwise goes to the catch block
			try {
				await axios.post("/api/auth/refresh");
				setIsLoggedIn(true);
			} catch {
				setIsLoggedIn(false);
			}
		};

		check();
	}, [setIsLoggedIn]);

	return null;
};
