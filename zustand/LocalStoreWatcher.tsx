import axios from "axios";
import { useEffect } from "react";
import { useLocalStore } from "./localStore";

export const LocalStoreWatcher = () => {
	const setLoggedIn = useLocalStore((state) => state.setLoggedIn);

	useEffect(() => {
		const check = async () => {
            // returns 200 if logged in, otherwise goes to the catch block
			try {
				await axios.post("/api/auth/refresh");
				setLoggedIn(true);
			} catch {}
		};

		check();
	}, [setLoggedIn]);

	return null;
};
