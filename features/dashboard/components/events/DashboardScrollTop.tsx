import { Button } from "@/features/ui/button/components/Button";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type React from "react";
import { createPortal } from "react-dom";

import arrowImg from "../../../../public/arrow.svg";

type Props = {
	isVisible: boolean;
	scrollRef: React.RefObject<HTMLUListElement | null>;
};

export const DashboardScrollTop = ({ isVisible, scrollRef }: Props) => {
	return createPortal(
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					className="flex flex-col items-center justify-between p-3 fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-linear-to-bl 
                from-background-2 to-background-1 outline-1 outline-background-5 hover:scale-110 hover:brightness-150 duration-300"
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
						<Image className="image" src={arrowImg} alt="scroll top" />
						<span>
							<small>Scroll</small>
						</span>
					</Button>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
};
