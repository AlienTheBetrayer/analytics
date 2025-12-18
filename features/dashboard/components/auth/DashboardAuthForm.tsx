import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { useSessionStore } from "@/zustand/sessionStore";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";

export const DashboardAuthForm = () => {
	// zustand
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

	// controller
	const auth = useAuth();

	return (
		<div className="flex flex-col gap-2">
			<form
				ref={auth.formRef}
				className="flex flex-col gap-2 p-2"
				onSubmit={auth.onFormSubmit}
			>
				{!isLoggedIn && (
					<>
						<Input
							value={auth.code ?? ""}
							placeholder="Code"
							onChange={auth.onCodeChange}
							type="password"
							aria-label="Password"
							required
							minLength={6}
							isEnabled={!isLoggedIn}
						/>

						<Tooltip
							description="Obtain full access"
							direction="left"
							isEnabled={!isLoggedIn}
						>
							<Button className="w-full" type="submit" isEnabled={!isLoggedIn}>
								{auth.isLoading?.signIn && <Spinner />}
								Sign in
							</Button>
						</Tooltip>
					</>
				)}

				<Tooltip
					description="Lose permissions"
					direction="left"
					isEnabled={isLoggedIn}
				>
					<Button
						className="w-full"
						type="button"
						onClick={auth.onLogout}
						isEnabled={isLoggedIn}
					>
						<small>{auth.isLoading?.logOut && <Spinner />}</small>
						<small>Log out</small>
					</Button>
				</Tooltip>

				{auth.status !== null && (
					<motion.div
						className="mt-2 text-center"
						key={`${auth.status}`}
						initial={{ y: 10 }}
						animate={{ y: 0 }}
					>
						<span>
							{auth.status === "success" ? (
								<>
									Logged in (<mark>Full access</mark>)
								</>
							) : (
								<u>Wrong password</u>
							)}
						</span>
					</motion.div>
				)}
			</form>
		</div>
	);
};
