import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type BlurConfig = {
	isEnabled?: boolean;
	className?: string;
};

export const usePopup = (
	component: React.ReactNode,
	onClose?: () => void,
	blurConfig?: BlurConfig,
) => {
	// client-side-only
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// states
	const [isShown, setIsShown] = useState<boolean>(false);

	// hotkeys
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
			switch (e.code) {
				case "Escape":
					setIsShown(false);
					onClose?.();
					break;
			}
		};
		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, [onClose]);

	// user functions
	const render = useCallback(() => {
		if (!mounted) return null;

		return createPortal(
			<>
				<AnimatePresence>{isShown && component}</AnimatePresence>
				{(blurConfig?.isEnabled ?? true) && (
					<AnimatePresence>
						{isShown && (
							<motion.div
								className={`fixed inset-0 z-32 ${blurConfig?.className ?? "backdrop-blur-xs"}`}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => {
									setIsShown(false);
									onClose?.();
								}}
							/>
						)}
					</AnimatePresence>
				)}
			</>,
			document.body,
		);
	}, [isShown, component, mounted, blurConfig, onClose]);

	const show = useCallback(() => {
		setIsShown(true);
	}, []);

	const hide = useCallback(() => {
		setIsShown(false);
	}, []);

	return {
		isShown,
		show,
		hide,
		render,
	};
};
