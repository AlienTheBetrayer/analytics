import type React from "react";
import { useEffect } from "react";

export const useScroll = <T extends HTMLElement>(
	ref: React.RefObject<T>,
	onChange: (value: number) => void,
) => {
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
	}, [ref, onChange]);
};
