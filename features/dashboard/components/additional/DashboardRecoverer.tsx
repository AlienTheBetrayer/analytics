import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import eyeImg from "../../../../public/eye.svg";
import { useDashboardContext } from "../../context/DashboardContext";

export const DashboardRecover = () => {
	const [state, dispatch] = useDashboardContext();

	return (
		<AnimatePresence>
			{state.visible === false && (
				<motion.div
					className="flex items-center justify-between p-2 fixed top-4 left-4 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 z-10 gap-2 outline-1 outline-background-5 w-64"
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30 }}
					transition={{ ease: "backInOut", duration: 0.5 }}
				>
					<span className="flex gap-1 items-center">
						<Image className="image" alt="" src={eyeImg} />
						Dashboard is <u>hidden</u>
					</span>
					<Tooltip description="Bring the dashboard back">
						<Button
							onClick={() => dispatch({ type: "SET_VISIBLE", flag: true })}
						>
							<mark>Show</mark>
						</Button>
					</Tooltip>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
