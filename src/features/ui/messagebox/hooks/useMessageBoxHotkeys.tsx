import { useEffect } from "react";

export const useMessageBoxHotkeys = (onInteract: (response: "yes" | "no") => void) => {
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
            e.preventDefault();
			switch (e.code) {
				case "Escape":
					onInteract("no");
					break;
				case "Enter":
					onInteract("yes");
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, [onInteract]);
};
