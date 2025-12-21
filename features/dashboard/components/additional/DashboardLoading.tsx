import { AnimatePresence, motion } from "motion/react";
import { useDashboardContext } from "../../context/DashboardContext";
import type { useData } from "../../hooks/useData";
import "./DashboardLoading.css";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardLoading = ({ controller }: Props) => {
	const [state] = useDashboardContext();

	return (
		<AnimatePresence>
			{controller.data === null && state.isVisible === true && (
				<motion.div
					className="flex flex-col items-center justify-between p-2 fixed top-4 left-1/2 -translate-x-1/2 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 z-10 gap-2 outline-1 outline-background-5 w-64"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30, transition: { delay: 1 } }}
					transition={{ ease: "backInOut", duration: 0.5 }}
				>
					<span>Fetching...</span>
					<div className={`w-full h-1.5 rounded-full loading-slider`}></div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
