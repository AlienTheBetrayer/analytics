import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";

export const DashboardAuthForm = () => {
	// controller
	const auth = useAuth();

	return (
		<div className="flex flex-col gap-2">
			<form
				ref={auth.formRef}
				className="flex flex-col gap-2 p-2"
				onSubmit={auth.onFormSubmit}
			>
				<Input
					value={auth.code ?? ""}
					placeholder="Code"
					onChange={auth.onCodeChange}
					type="password"
					aria-label="Password"
					required
					minLength={6}
				/>

				<Tooltip description="Obtain full access" direction="left">
					<Button className="w-full" type="submit">
						{auth.isLoading?.signIn && <Spinner />}
						Sign in
					</Button>
				</Tooltip>

				<Tooltip description="Lose permissions" direction="left">
					<Button className="w-full" type="button" onClick={auth.onLogout}>
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
						<small>
							{auth.status === "success" ? (
								<mark>Full access</mark>
							) : (
								<u>Wrong password</u>
							)}
						</small>
					</motion.div>
				)}
			</form>
		</div>
	);
};
