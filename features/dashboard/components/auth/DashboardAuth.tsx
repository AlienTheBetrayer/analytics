import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardAuthForm } from "./DashboardAuthForm";
import { DashboardAuthRecoverer } from "./DashboardAuthRecoverer";
import { DashboardAuthTopline } from "./DashboardAuthTopline";

export const DashboardAuth = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						className="flex flex-col fixed top-4 right-4 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 z-10 outline-1 outline-background-5 w-64"
						initial={{ opacity: 0, y: -30 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -30 }}
						transition={{ ease: "backInOut", duration: 0.5 }}
					>
						<DashboardAuthTopline onInteract={() => setIsVisible(false)} />
						<DashboardAuthForm />
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{!isVisible && (
					<DashboardAuthRecoverer onInteract={() => setIsVisible(true)} />
				)}
			</AnimatePresence>
		</>
	);
};
