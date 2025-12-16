import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import axios from "axios";
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
						Sign in
					</Button>
				</Tooltip>
				<Tooltip description="Lose permissions" direction="left">
					<Button className="w-full" type="button" onClick={auth.onLogout}>
						<small>Log out</small>
					</Button>
				</Tooltip>
				{JSON.stringify(auth.status)}
				<Button
					onClick={() => {
						axios
							.post("api/auth/check_login")
							.then((res) => {
								alert(JSON.stringify(res.data));
							})
							.catch((e) => {
								alert(`error: ${e}`);
							});
					}}
				>
					Check
				</Button>
			</form>
		</div>
	);
};
