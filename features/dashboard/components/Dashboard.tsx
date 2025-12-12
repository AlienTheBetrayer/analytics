import { Button } from "@/features/ui/button/components/Button";
import type { ComponentPropsWithoutRef } from "react";
import { useSync } from "../hooks/useSync";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// controller
	const controller = useSync();

	// ui states
	const hasSynced = controller.data !== null;

	return (
		<div
			className={`w-full h-full flex flex-col max-w-128 min-h-100 bg-background-2 rounded-xl ${className ?? ""}`}
		>
			<div className="w-full flex border-b border-b-background-4 p-2 items-center gap-1">
				<div
					className={`rounded-full w-1.5 h-1.5 ${hasSynced ? "bg-blue-500" : "bg-red-500"} duration-1000`}
				></div>
				<span>{hasSynced ? "Synced" : "Not synced"}</span>
				<Button onClick={controller.sync} className="ml-auto">
					Sync
				</Button>
				<Button onClick={() => controller.setAutoSyncEnabled((prev) => !prev)}>
					{controller.autoSyncEnabled === false ? 'Enable auto-sync' : 'Disable auto-sync'}
				</Button>
			</div>

			<div className="w-full grow p-2">
				<span>{JSON.stringify(controller.data)}</span>
			</div>

			<div className="w-full p-2"></div>
		</div>
	);
};
