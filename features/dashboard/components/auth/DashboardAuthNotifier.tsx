import { useSessionStore } from "@/zustand/sessionStore";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

export const DashboardAuthNotifier = React.memo(() => {
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
	return (
		<AnimatePresence>
			{isLoggedIn && (
				<motion.div
					className="flex flex-col items-center justify-between p-3 fixed bottom-4 left-4 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 outline-1 outline-background-5 hover:scale-105 hover:brightness-150 duration-300"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 30 }}
					transition={{ ease: "backInOut", duration: 0.5 }}
				>
					<span>
						<small>Login status</small>
					</span>
					<h3>
						<mark>Authenticated!</mark>
					</h3>
				</motion.div>
			)}
		</AnimatePresence>
	);
});
