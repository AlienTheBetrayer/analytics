import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { useCallback, useRef, useState } from "react";

export const DashboardAuthForm = () => {
	// states
	const [username, setUsername] = useState<string>("");
	const [code, setCode] = useState<string>("");

	// refs + validity
	const formRef = useRef<HTMLFormElement | null>(null);

	const validateForm = useCallback(() => {
		if (formRef.current) {
			formRef.current.reportValidity();
		}
	}, []);

	return (
		<div className="flex flex-col gap-2">
			<form
				ref={formRef}
				className="flex flex-col gap-2 p-2"
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<Input
					value={username}
					placeholder="Username"
					onChange={(value) => {
						setUsername(value);
						validateForm();
					}}
					onDelete={() => setUsername("")}
					aria-label="Username"
					required
					minLength={6}
					className="invalid:bg-blue-100"
				/>
				<Input
					value={code}
					placeholder="Code"
					onChange={(value) => {
						setCode(value);
						validateForm();
					}}
					type="password"
					aria-label="Password"
					required
					minLength={6}
					className="invalid:bg-blue-100"
				/>
				<Tooltip description="Obtain full access" direction="left">
					<Button className="w-full" type="submit">
						Sign in
					</Button>
				</Tooltip>
				<Tooltip description="Lose permissions" direction="left">
					<Button className="w-full">
						<small>Log out</small>
					</Button>
				</Tooltip>
			</form>
		</div>
	);
};
