import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import dashboardImg from "../../../../public/dashboard.svg";
import { useDashboardContext } from "../../context/DashboardContext";

export const DashboardRecoverer = () => {
	const [state, dispatch] = useDashboardContext();

	return (
		<AnimatePresence>
			{state.isVisible === false && (
				<motion.div
					className="flex items-center justify-between fixed top-4 left-4 p-2 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 z-10 gap-4 outline-1 outline-background-5 w-fit sm:min-w-64"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30 }}
					transition={{ ease: "backInOut", duration: 0.5 }}
				>
					<span className="flex gap-1 items-center">
						<Image className="image w-5! h-5!" alt="" src={dashboardImg} />
						<span className="hidden sm:inline whitespace-nowrap">
							Dashboard is <u>hidden</u>
						</span>
					</span>
					<Tooltip description="Bring the dashboard back" direction="right">
						<Button
							onClick={() => dispatch({ type: "SET_IS_VISIBLE", flag: true })}
						>
							<small>Show</small>
						</Button>
					</Tooltip>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
