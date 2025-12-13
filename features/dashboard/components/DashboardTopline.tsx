import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import type { useSync } from "../hooks/useSync";

type Props = {
	controller: ReturnType<typeof useSync>;
};

export const DashboardTopline = ({ controller }: Props) => {
	return (
		<div className="w-full flex border-b border-b-background-4 px-2 py-1 items-center gap-1 flex-wrap">
			<span className="flex gap-1 items-center">
				<div
					className={`rounded-full w-1.5 h-1.5 ${controller.data !== null ? "bg-blue-500" : "bg-red-500"} duration-1000`}
				/>
				{controller.data !== null ? "Synced" : "Not synced"}
				{controller.data === null && <Spinner className="w-3! h-3!" />}
			</span>

			<div className="flex gap-1 ml-auto flex-wrap justify-center">
				<Button onClick={controller.resync}>
					{controller.isSyncing.current === true && (
						<Spinner className="w-3! h-3!" />
					)}
					Sync
				</Button>

				<Button onClick={() => controller.setAutoSyncEnabled((prev) => !prev)}>
					{controller.autoSyncEnabled === false
						? "Enable auto-sync"
						: "Disable auto-sync"}
				</Button>
			</div>
		</div>
	);
};
