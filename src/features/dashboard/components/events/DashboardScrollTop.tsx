import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type React from "react";
import { Button } from "@/features/ui/button/components/Button";

type Props = {
	isVisible: boolean;
	scrollRef: React.RefObject<HTMLElement | null>;
};

export const DashboardScrollTop = ({ isVisible, scrollRef }: Props) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className="flex flex-col items-center justify-between p-3 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 outline-1 outline-background-5 hover:scale-110 hover:brightness-150 duration-300 ease-out
                absolute -bottom-8 left-1/2! -translate-x-1/2 z-999"
				>
					<Button
						onClick={() => {
							if (scrollRef) {
								scrollRef.current?.scrollTo({
									top: 0,
									behavior: "smooth",
								});
							}
						}}
					>
						<Image src="/arrow.svg" alt="scroll top" width={16} height={16} />
						<span>
							Scroll
						</span>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
