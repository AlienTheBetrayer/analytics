import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { useSessionStore } from "@/zustand/sessionStore";
import { motion } from "motion/react";
import Image from "next/image";
import authImg from "../../../../public/auth.svg";
import { useDashboardContext } from "../../context/DashboardContext";

export const DashboardAuth = () => {
	// zustand / global state
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);
	const [, dashboardDispatch] = useDashboardContext();

	return (
		<motion.div
			className="flex gap-1 items-center rounded-xl bg-linear-to-bl fixed top-4 right-4
                    from-background-2 to-background-1 z-10 outline-1 outline-background-5 p-2"
			initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -30 }}
			transition={{ ease: "backInOut", duration: 0.5 }}
		>
			<Image className="image w-5! h-5!" alt="" src={authImg} />

			{isLoggedIn ? (
				<Tooltip
					description="Log out of all accounts"
					direction="left"
					className="ml-8"
				>
					<Button
						onClick={() => {
							dashboardDispatch({ type: "AUTH_FORM_SET", flag: "logout" });
						}}
					>
						<small>Log out</small>
					</Button>
				</Tooltip>
			) : (
				<>
					<Tooltip
						description="Create a new account"
						direction="left"
						className="ml-4"
					>
						<Button
							onClick={() => {
								dashboardDispatch({ type: "AUTH_FORM_SET", flag: "register" });
							}}
						>
							<small>Register</small>
						</Button>
					</Tooltip>

					<Tooltip description="Login in the existing account" direction="left">
						<Button
							onClick={() => {
								dashboardDispatch({ type: "AUTH_FORM_SET", flag: "login" });
							}}
						>
							<small>Log in</small>
						</Button>
					</Tooltip>
				</>
			)}
		</motion.div>
	);
};
