import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageBox } from "../components/MessageBox";

export const useMessageBox = (
	title: string,
	description: string,
	onInteract: (response: "yes" | "no") => void,
) => {
	// client-side hook
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
					onInteract("no");
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, [onInteract]);

	// user functions
	const render = useCallback(() => {
		if (mounted === false) return null;

		return createPortal(
			<>
				<AnimatePresence>
					{isShown && (
						<MessageBox
							title={title}
							description={description}
							onInteract={(res) => {
								setIsShown(false);
								onInteract(res);
							}}
						/>
					)}
				</AnimatePresence>
				<AnimatePresence>
					{isShown && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="z-998 fixed inset-0 backdrop-blur-[5px]"
							onClick={() => {
								onInteract("no");
								setIsShown(false);
							}}
						/>
					)}
				</AnimatePresence>
			</>,
			document.body,
		);
	}, [title, description, onInteract, isShown, mounted]);

	const show = useCallback(() => {
		setIsShown(true);
	}, []);

	const hide = useCallback(() => {
		setIsShown(false);
	}, []);

	return {
		render,
		show,
		hide,
		isShown,
	};
};
