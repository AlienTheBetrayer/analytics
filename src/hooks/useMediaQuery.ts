import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
    // react states
	const [hasMatched, setHasMatched] = useState<boolean>(
		window.matchMedia(query).matches,
	);

    // watching query change
	useEffect(() => {
		const mQuery = window.matchMedia(query);
		setHasMatched(mQuery.matches);
        
		const handle = (event: MediaQueryListEvent) => {
			setHasMatched(event.matches);
		};

		mQuery.addEventListener("change", handle);
		return () => mQuery.removeEventListener("change", handle);
	}, [query]);

	return hasMatched;
};
