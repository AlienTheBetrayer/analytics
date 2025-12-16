import { useNotification } from "@/features/notification/hooks/useNotification";
import { createContext, useContext } from "react";

export type NotificationContextType = ReturnType<typeof useNotification>;

export const NotificationContext =
	createContext<NotificationContextType | null>(null);

export type Props = {
	children?: React.ReactNode;
};

export const NotificationProvider = ({ children }: Props) => {
	const notifications = useNotification();

	return (
		<NotificationContext.Provider value={notifications}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotificationContext = () => {
	const ctx = useContext(NotificationContext);
	if (!ctx) throw new Error("useNotificationContext() is not used correctly.");
	return ctx;
};
