import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import type { useAuth } from "@/features/dashboard/hooks/useAuth";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { motion } from "motion/react";

type Props = {
	auth: ReturnType<typeof useAuth>;
};

export const RegisterForm = ({ auth }: Props) => {
	const [, dashboardDispatch] = useDashboardContext();

	const hasRegistered = auth.status?.message === "Registered";

    return (
		<motion.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 5 }}
			className="flex flex-col gap-2 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 
                z-100 bg-background-2 rounded-xl p-2 w-80"
		>
			{/* topline */}
			<div className="relative gap-2 flex items-center justify-between w-full border-b border-b-background-5 p-2">
				<Tooltip description="Easter egg 🌀" direction="top">
					<div className="rounded-full bg-blue-1 w-1.5 h-1.5" />
				</Tooltip>
				<h4>
					<mark>Account creation</mark>
				</h4>
				<Tooltip
					description="Hide this window"
					className="ml-auto"
					direction="top"
				>
					<Button
						className="ml-auto"
						onClick={() => {
							dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
						}}
					>
						<small>✕ Hide</small>
					</Button>
				</Tooltip>
			</div>

			{/* main form */}
			<form
				ref={auth.formRef}
				className="flex flex-col gap-3 p-2"
				onSubmit={(e) => {
					e.preventDefault();
					auth.onRegister();
				}}
			>
				<Input
					value={auth.data.username ?? ""}
					placeholder={"Username"}
					onChange={auth.onUsernameChange}
					type="text"
					aria-label="Username"
					required
					minLength={6}
				/>

				<Input
					value={auth.data.password ?? ""}
					placeholder={"Password"}
					onChange={auth.onPasswordChange}
					type="password"
					aria-label="Password"
					required
					minLength={6}
				/>

				<Tooltip
					description={"Create an account"}
					direction={"bottom"}
					isEnabled={!hasRegistered}
				>
					<Button className="w-full" type="submit" isEnabled={!hasRegistered}>
						{auth.promiseStatus.get("register") === "pending" && <Spinner />}
						Register
					</Button>
				</Tooltip>

				{hasRegistered && (
					<Tooltip description={"Redirect to log in"} direction={"bottom"}>
						<Button
							className="w-full"
							type="button"
							onClick={async () => {
								dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
								setTimeout(() => {
									dashboardDispatch({ type: "AUTH_FORM_SET", flag: "login" });
								}, 300);
							}}
						>
							Redirect to log in
						</Button>
					</Tooltip>
				)}
			</form>

			{/* status message */}
			{auth.status && (
				<>
					<hr />
					<div className="flex gap-1 items-center mx-auto">
						<div
							className={`rounded-full w-2 h-2 ${auth.status.ok ? "bg-blue-1" : "bg-red-1"} shrink-0`}
						/>
						<span>{auth.status.ok ? "Success!" : "ERROR:"}</span>
						<span>{auth.status.message}</span>
					</div>
				</>
			)}
		</motion.div>
	);
};
