import { useEffect, useRef } from "react";

export const useScroll = <T extends HTMLElement>(onChange: (value: number) => void) => {
	// refs
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const handle = () => {
			if (ref.current) {
				const scroll =
					ref.current.scrollTop /
					(ref.current.scrollHeight - ref.current.clientHeight);
				onChange(scroll);
			}
		};

		ref.current?.addEventListener("scroll", handle);
		return () => ref.current?.removeEventListener("scroll", handle);
	}, [onChange]);

	return { ref };
};
