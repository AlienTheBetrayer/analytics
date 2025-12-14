import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	Notification,
	type NotificationData,
} from "../components/Notification";

export const useNotification = () => {
	// states
	const [isShown, setIsShown] = useState<boolean>(false);
	const [notificationData, setNotificationData] = useState<NotificationData>({
		content: "show() method is used incorrectly.",
		type: "error",
	});
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// refs
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// user functions
	const render = useCallback(() => {
		if (!mounted) return null;

		return createPortal(
			<AnimatePresence>
				{isShown && (
					<Notification
						data={notificationData}
						onInteract={() => {
							if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
							setIsShown(false);
						}}
					/>
				)}
			</AnimatePresence>,
			document.body,
		);
	}, [isShown, notificationData, mounted]);

	const show = useCallback((data: NotificationData, timer: boolean = true) => {
		setNotificationData(data);
		setIsShown(true);
		if (timer) {
			timeoutRef.current = setTimeout(() => setIsShown(false), 3000);
		}
	}, []);

	return {
		render,
		show,
	};
};
