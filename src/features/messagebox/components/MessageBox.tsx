import { motion } from "motion/react";
import { useMessageBoxHotkeys } from "../hooks/useMessageBoxHotkeys";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";

type Props = {
	title: string;
	description: string;
	onInteract: (response: "yes" | "no") => void;
};

export const MessageBox = ({ title, description, onInteract }: Props) => {
	// hotkeys
	useMessageBoxHotkeys(onInteract);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col justify-between items-center z-999 fixed
             left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-3xl
              outline-2 outline-background-5 bg-background-2 p-4 gap-4 min-h-32 w-64"
		>
			<h3 className="text-center">
				<u>{title}</u>
			</h3>

			<span className="text-center w-full">{description}</span>

			<div className="grid grid-cols-2 w-full gap-2">
				<Tooltip description="Confirm">
					<Button onClick={() => onInteract("yes")} className="w-full">
						<small>Yes</small>
					</Button>
				</Tooltip>
				<Tooltip description="Reject">
					<Button onClick={() => onInteract("no")} className="w-full">
						<small>No</small>
					</Button>
				</Tooltip>
			</div>
		</motion.div>
	);
};
