import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { motion } from "motion/react";
import Image from "next/image";
import authImg from "../../../../public/auth.svg";

type Props = {
	onInteract: () => void;
};

export const DashboardAuthRecoverer = ({ onInteract }: Props) => {
	return (
		<motion.div
			className="flex gap-1 fixed items-center top-4 right-4 rounded-xl bg-linear-to-bl 
                    from-background-2 to-background-1 z-10 outline-1 outline-background-5 w-64 p-2"
			initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ ease: "backInOut", duration: 0.5 }}
		>
			<Image className="image w-5! h-5!" alt="" src={authImg} />
			<h4>
				Authentication is <u>hidden</u>
			</h4>
			<Tooltip
				className="ml-auto"
				description="Bring the authentication back"
				direction="left"
			>
				<Button onClick={onInteract}>
					<small>Show</small>
				</Button>
			</Tooltip>
		</motion.div>
	);
};
