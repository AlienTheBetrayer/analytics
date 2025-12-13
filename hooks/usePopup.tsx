import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const usePopup = (component: React.ReactNode) => {
	// states
	const [isShown, setIsShown] = useState<boolean>(false);
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const render = useCallback(() => {
		if (!mounted) return null;

		return createPortal(
			<AnimatePresence>{isShown && component}</AnimatePresence>,
			document.body,
		);
	}, [isShown, component, mounted]);

	return {
		isShown,
		setIsShown,
		render,
	};
};
