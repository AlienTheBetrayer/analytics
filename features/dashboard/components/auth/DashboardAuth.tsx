import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardAuthRecoverer } from "./DashboardAuthRecoverer";

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
						<div className="relative flex items-center justify-between w-full border-b border-b-background-5 p-2">
							<h4 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
								<mark>Authenticate</mark>
							</h4>
							<Tooltip
								description="Hide this window"
								className="ml-auto"
								direction="left"
							>
								<Button
									className="min-h-7! h-7 ml-auto"
									onClick={() => setIsVisible(false)}
								>
									<small>✕ Hide</small>
								</Button>
							</Tooltip>
						</div>

						<div className="flex flex-col gap-2 p-2">
							<Input placeholder="Code" />
							<Tooltip description="Obtain full access" direction="left">
								<Button className="w-full">Sign in</Button>
							</Tooltip>
							<Tooltip description="Lose permissions">
								<Button className="w-full">
									<small>Log out</small>
								</Button>
							</Tooltip>
						</div>
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
