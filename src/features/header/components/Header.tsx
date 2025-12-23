"use client";
import { motion } from "motion/react";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { HeaderButtons } from "../utils/buttons";

export const Header = () => {
	return (
		<motion.header
			initial={{ opacity: 0, y: -32 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.7,
				type: "spring",
				stiffness: 200,
				damping: 40,
			}}
			className="fixed flex items-center p-2 px-4 top-4 left-1/2 -translate-x-1/2 
            box border-0! w-full max-w-lg h-12 z-3"
		>
			<nav className="flex gap-4 w-full">
				{HeaderButtons.map((button) => (
					<LinkButton
						href={button.href}
						style="link"
						key={button.href}
						className={button.className ?? ""}
					>
						{button.text}
					</LinkButton>
				))}
			</nav>
		</motion.header>
	);
};
