import type { ComponentPropsWithoutRef } from "react";
import { useSync } from "../hooks/useSync";
import { DashboardMain } from "./DashboardMain";
import { DashboardTopline } from "./DashboardTopline";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// controller
	const controller = useSync();

	return (
		<div
			className={`w-full h-full flex flex-col max-w-lg bg-background-2 rounded-xl ${className ?? ""}`}
		>
			<DashboardTopline controller={controller} />
			<DashboardMain controller={controller} />
		</div>
	);
};
