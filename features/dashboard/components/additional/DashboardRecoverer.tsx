import { motion } from "motion/react";

export const DashboardRecover = () => {
	return (
		<motion.div
			className="flex flex-col fixed top-4 left-4 rounded-xl bg-linear-to-bl from-background-2 to-background-1 z-10"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}/>
	);
};
