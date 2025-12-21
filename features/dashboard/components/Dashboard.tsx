"use client";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useDashboardContext } from "../context/DashboardContext";
import { useNotificationContext } from "../context/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { useAuthForms } from "../hooks/useAuthForms";
import { useData } from "../hooks/useData";
import { DashboardLoading } from "./additional/DashboardLoading";
import { DashboardRecoverer } from "./additional/DashboardRecoverer";
import { DashboardAuth } from "./auth/DashboardAuth";
import { DashboardAuthNotifier } from "./auth/DashboardAuthNotifier";
import { DashboardMain } from "./DashboardMain";
import { DashboardTopline } from "./DashboardTopline";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// state
	const [dashboardState] = useDashboardContext();

	// misc (notifications)
	const notifications = useNotificationContext();

	// controller
	const controller = useData({
		onSync: () => {
			notifications.show({
				type: "information",
				content: "Successfully synced data!",
			});
		},
		onError: (message: string) => {
			notifications.show({ type: "error", content: message });
		},
	});

	// auth controller + its forms
	const auth = useAuth();
	const authForms = useAuthForms(auth);

	return (
		<>
			{notifications.render(dashboardState.isVisible)}
			{authForms.render()}

			<DashboardRecoverer />
			<DashboardAuth />

			<DashboardLoading controller={controller}/>
			<DashboardAuthNotifier />

			<AnimatePresence>
				{dashboardState.isVisible && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className={`w-full h-full flex flex-col max-w-140 rounded-xl bg-linear-to-bl from-background-2 to-background-1 ${className ?? ""} md:hover:scale-105 duration-300`}
					>
						<DashboardTopline controller={controller} />
						<DashboardMain controller={controller} />
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
