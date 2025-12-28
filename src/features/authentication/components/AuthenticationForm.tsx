import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import type { ResponseAxios } from "@/types/zustand/utils/axios";
import { Spinner } from "../../spinner/components/Spinner";
import { Tooltip } from "../../tooltip/components/Tooltip";
import { Button } from "../../ui/button/components/Button";
import { Input } from "../../ui/input/components/Input";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import {
	type RetrievedResponse,
	retrieveResponse,
} from "../utils/retrieveResponse";

type Props = {
	title: string;
	button: {
		text: string;
		tooltip: string;
	};
	onSubmit: (username: string, password: string) => Promise<ResponseAxios>;
	className?: string;
	type?: "login" | "register";
};

export const AuthenticationForm = ({
	title,
	button,
	onSubmit,
	className,
	type = "login",
}: Props) => {
	// input states
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// authentication internal states
	const [response, setResponse] = useState<RetrievedResponse | undefined>();

	// spinners
	const promises = usePromiseStatus();

	return (
		<motion.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 5 }}
			className={`flex flex-col max-w-96 w-full z-2
                sm:hover:scale-105 duration-300 ease-out box
                 ${className ?? ""}`}
		>
			{/* topline */}
			<div className="relative gap-2 flex flex-wrap items-center w-full border-b border-b-background-5 p-2">
				<Tooltip description="Easter egg 🌀" direction="top">
					<div className="rounded-full bg-blue-1 w-1.5 h-1.5" />
				</Tooltip>
				<span className="text-foreground-5!">{title}</span>
				<Tooltip
					description="Come back home"
					className="ml-auto"
					direction="top"
				>
					<LinkButton className="ml-auto" href="/home">
						✕ Back
					</LinkButton>
				</Tooltip>
			</div>

			{/* main form */}
			<form
				className="flex flex-col gap-3 p-2"
				onSubmit={async (e) => {
					e.preventDefault();

					if (e.currentTarget.checkValidity()) {
						promises.wrap("auth_action", async () => {
							const res = await retrieveResponse(
								async () => await onSubmit(username, password),
							);
							setResponse(res.retrievedResponse);
						});
					}

					if (e.currentTarget.checkValidity()) {
						promises.wrap("register", async () => {});
					}
				}}
			>
				<label htmlFor="username" className="flex justify-between">
					Username
					{type === "register" && <small>(your unique name)</small>}
				</label>
				<Input
					id="username"
					value={username}
					placeholder={"at least 6 characters"}
					onChange={(value) => setUsername(value)}
					type="text"
					aria-label="Username"
					required
					minLength={6}
				/>
				<hr />

				<label htmlFor="password" className="flex justify-between">
					Password
					{type === "register" && <small>(create a strong password)</small>}
				</label>
				<Input
					id="password"
					value={password}
					placeholder={"at least 6 characters"}
					onChange={(value) => setPassword(value)}
					type="password"
					aria-label="Password"
					required
					minLength={6}
				/>
				<hr />

				<Tooltip description={button.tooltip} direction={"bottom"}>
					<Button className="w-full" type="submit">
						{promises.get("auth_action") === "pending" && <Spinner />}
						<Image alt="" width={20} height={20} src="/send.svg" />
						{button.text}
					</Button>
				</Tooltip>
			</form>

			{response?.type === "user_registered" && (
				<>
					<hr />
					<Tooltip
						description={"Proceed the authentication"}
						direction={"bottom"}
					>
						<LinkButton className="w-full" href="/login">
							Redirect to log in
						</LinkButton>
					</Tooltip>
				</>
			)}

			{/* status message */}
			{response !== undefined && (
				<>
					<hr />
					<div className="flex gap-2 items-center mx-auto">
						<div
							className={`rounded-full w-2 h-2 ${response.status === "ok" ? "bg-blue-1" : "bg-red-1"} shrink-0`}
						/>
						<span>{response.message}</span>
					</div>
				</>
			)}
		</motion.div>
	);
};
