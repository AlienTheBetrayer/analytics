"use client";
import { useNotification } from "@/features/notification/hooks/useNotification";
import { usePopup } from "@/hooks/usePopup";
import { AnimatePresence, motion } from "motion/react";
import { type ComponentPropsWithoutRef, useEffect } from "react";
import { useDashboardContext } from "../context/DashboardContext";
import { useData } from "../hooks/useData";
import { DashboardRecover } from "./additional/DashboardRecoverer";
import { DashboardMain } from "./DashboardMain";
import { DashboardTopline } from "./DashboardTopline";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// misc (notifications)
	const notifications = useNotification({ content: "", type: "error" });

	// controller
	const controller = useData({
		onSync: () => {
			notifications.show({
				type: "information",
				content: "Successfully synced data!",
			});
		},
		onError: (message: string) => {
			notifications.show({ type: "information", content: message }, false);
		},
	});

	// state
	const [state, dispatch] = useDashboardContext();

	const recovererPopup = usePopup(
		<DashboardRecover
			onInteract={() => {
				dispatch({ type: "SET_VISIBLE", flag: true });
			}}
		/>,
	);

	useEffect(() => {
		recovererPopup.setIsShown(!state.visible);
	}, [state.visible, recovererPopup.setIsShown]);

	return (
		<>
			{recovererPopup.render()}
			<AnimatePresence>
				{state.visible && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className={`w-full h-full flex flex-col max-w-lg rounded-xl bg-linear-to-bl from-background-2 to-background-1 ${className ?? ""} hover:scale-105 duration-300`}
					>
						{notifications.render()}
						<DashboardTopline controller={controller} />
						<DashboardMain controller={controller} />
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
