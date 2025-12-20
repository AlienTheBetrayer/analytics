import type { AuthStatus } from "@/features/dashboard/hooks/useAuth";
import { Spinner } from "@/features/spinner/components/Spinner";
import {
	Tooltip,
	type TooltipDirection,
} from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { motion } from "motion/react";
import { type FormEvent, forwardRef, type HTMLInputTypeAttribute } from "react";

type FormInput = {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	type?: HTMLInputTypeAttribute;
	isEnabled?: boolean;
};

type FormButton = {
	text: string;
	onClick?: () => void;
	promiseKey?: string;
	tooltip?: string;
	direction?: TooltipDirection;
	isEnabled?: boolean;
};

type Props = {
	inputs: FormInput[];
	buttons: FormButton[];
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onHide: () => void;
	promises?: ReturnType<typeof usePromiseStatus>;
	status?: AuthStatus;
	title?: string;
};

export const DashboardAuthForm = forwardRef<HTMLFormElement, Props>(
	(
		{ inputs, buttons, onSubmit, onHide, title, promises, status }: Props,
		ref,
	) => {
		return (
			<motion.div
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 5 }}
				className="flex flex-col gap-2 fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 
                z-100 bg-background-2 rounded-xl p-2 min-w-72"
			>
				{/* topline */}
				<div className="relative gap-2 flex items-center justify-between w-full border-b border-b-background-5 p-2">
					<Tooltip description="Easter egg 🌀" direction="top">
						<div className="rounded-full bg-blue-1 w-1.5 h-1.5" />
					</Tooltip>
					<h4>
						<mark>{title ?? "Authentication"}</mark>
					</h4>
					<Tooltip
						description="Hide this window"
						className="ml-auto"
						direction="top"
					>
						<Button className="ml-auto" onClick={onHide}>
							<small>✕ Hide</small>
						</Button>
					</Tooltip>
				</div>

				{/* main form */}
				<form
					ref={ref}
					className="flex flex-col gap-3 p-2"
					onSubmit={(e) => {
						e.preventDefault();

						onSubmit(e);
					}}
				>
					{inputs.map((input) => (
						<Input
							key={input.placeholder}
							value={input.value}
							placeholder={input.placeholder}
							onChange={input.onChange}
							type={input.type ?? "text"}
							aria-label="Password"
							required
							minLength={6}
							isEnabled={input.isEnabled ?? true}
						/>
					))}

					{buttons.map((button) => (
						<Tooltip
							key={button.text}
							description={button.tooltip ?? button.text}
							direction={button.direction ?? "bottom"}
							isEnabled={button.isEnabled ?? true}
						>
							<Button
								className="w-full"
								type="submit"
								isEnabled={button.isEnabled ?? true}
								onClick={() => {
									button.onClick?.();
								}}
							>
								{promises &&
									button.promiseKey &&
									promises.get(button.promiseKey) === "pending" && <Spinner />}
								{button.text}
							</Button>
						</Tooltip>
					))}
				</form>

                {/* status message */}
				{status && (
					<div className="flex gap-1 items-center mx-auto">
						<div
							className={`rounded-full w-2 h-2 ${status.ok ? "bg-blue-1" : "bg-red-1"}`}
						/>
						<span>{status.ok ? "Success!" : "ERROR:"}</span>
						<span>{status.message}</span>
					</div>
				)}
			</motion.div>
		);
	},
);
