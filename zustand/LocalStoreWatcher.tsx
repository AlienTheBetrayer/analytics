"use client";
import axios from "axios";
import { useEffect } from "react";
import { useLocalStore } from "./localStore";

export const LocalStoreWatcher = () => {
	const setIsLoggedIn = useLocalStore((state) => state.setIsLoggedIn);

	useEffect(() => {
		const check = async () => {
			// returns 200 if logged in, otherwise goes to the catch block
			try {
				await axios.post("/api/auth/refresh");
				setIsLoggedIn(true);
			} catch {}
		};

		check();
	}, [setIsLoggedIn]);

	return null;
};
