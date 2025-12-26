import { motion } from "motion/react";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useMessageBoxHotkeys } from "../hooks/useMessageBoxHotkeys";

type Props = {
	title?: string;
	description: string;
	onInteract: (response: "yes" | "no") => void;
};

export const MessageBox = ({
	title = "Are you sure?",
	description,
	onInteract,
}: Props) => {
	// hotkeys
	useMessageBoxHotkeys(onInteract);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col justify-between items-center z-999 fixed
             left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-4xl
              outline-2 outline-background-5 bg-background-a-2 backdrop-blur-3xl p-4 gap-2 min-h-42 w-72"
		>
			<span className="text-center text-5! text-foreground-4!">
				<u>{title}</u>
			</span>

			<span className="text-center w-full">{description}</span>
			<hr />
			<div className="grid grid-cols-2 w-full gap-2">
				<Tooltip description="Confirm">
					<Button onClick={() => onInteract("yes")} className="w-full">
						Yes
					</Button>
				</Tooltip>
				<Tooltip description="Reject">
					<Button onClick={() => onInteract("no")} className="w-full">
						No
					</Button>
				</Tooltip>
			</div>
		</motion.div>
	);
};
