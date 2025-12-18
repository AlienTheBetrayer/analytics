import { Button } from "@/features/ui/button/components/Button";
import { motion } from "motion/react";

type Props = {
	title: string;
	description: string;
	onInteract: (response: "yes" | "no") => void;
};

export const MessageBox = ({ title, description, onInteract }: Props) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col justify-between items-center z-999 fixed
             left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-3xl
              outline-2 outline-background-5 bg-background-2 p-3 gap-2 min-h-42 w-80"
		>
			<h3 className="text-center">{title}</h3>

			<span className="text-center w-full">
				{description}
			</span>

			<div className="grid grid-cols-2 w-full gap-4">
				<Button onClick={() => onInteract("yes")}>
					<small>Yes</small>
				</Button>
				<Button onClick={() => onInteract("no")}>
					<small>No</small>
				</Button>
			</div>
		</motion.div>
	);
};
