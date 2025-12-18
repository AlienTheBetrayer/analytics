import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";

type Props = {
	onInteract: () => void;
};

export const DashboardAuthTopline = ({ onInteract }: Props) => {
	return (
		<div className="relative flex items-center justify-between w-full border-b border-b-background-5 p-2">
			<Tooltip description="Easter egg 🌀" direction="left">
				<div className="rounded-full bg-blue-1 w-1.5 h-1.5" />
			</Tooltip>
			<h4 className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
				<mark>Authenticate</mark>
			</h4>
			<Tooltip
				description="Hide this window"
				className="ml-auto"
				direction="left"
			>
				<Button className="ml-auto" onClick={onInteract}>
					<small>✕ Hide</small>
				</Button>
			</Tooltip>
		</div>
	);
};
