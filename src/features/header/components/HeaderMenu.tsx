import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

type Props = {
	onInteract: () => void;
};

export const HeaderMenu = ({ onInteract }: Props) => {
	// zustand
	const status = useAppStore((state) => state.status);

	return (
		<motion.nav
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, pointerEvents: "all" }}
			exit={{ opacity: 0, pointerEvents: "none" }}
			transition={{ duration: 0.5 }}
			className="fixed z-100 inset-0 bg-background-a-1 backdrop-blur-lg md:hidden w-full h-full overflow-hidden"
			onClick={onInteract}
		>
			<ul className="w-full h-full flex flex-col justify-between p-8!">
				<div className="flex flex-col gap-4">
					<li>
						<LinkButton href="/home" className="p-4! text-5!">
							<Image src="/cube.svg" width={24} height={24} alt="" />
							Home
						</LinkButton>
					</li>
					<li>
						<LinkButton href="/dashboard" className="p-4! text-5!">
							<Image src="/dashboard.svg" width={24} height={24} alt="" />
							Dashboard
						</LinkButton>
					</li>
				</div>

				<div className="flex flex-col gap-4">
					{status && status.isLoggedIn === true ? (
						<li>
							<LinkButton href="/profile" className={`p-4! text-5!`}>
								<Image src="/account.svg" width={24} height={24} alt="" />
								Profile
							</LinkButton>
						</li>
					) : (
						<>
							<li>
								<LinkButton
									href="/register"
									className={`p-4! text-5! ${!status ? "border-awaiting" : ""}`}
								>
									<Image src="/plus.svg" width={24} height={24} alt="" />
									Register
								</LinkButton>
							</li>
							<li>
								<LinkButton
									href="/login"
									className={`p-4! text-5! ${!status ? "border-awaiting" : ""}`}
								>
									<Image src="/auth.svg" width={24} height={24} alt="" />
									Log in
								</LinkButton>
							</li>
						</>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<li>
						<Button className="p-4! text-5! w-full">
							<Image src="/cross.svg" width={24} height={24} alt="" />
							Hide
						</Button>
					</li>
				</div>
			</ul>
		</motion.nav>
	);
};
