import type { ComponentPropsWithoutRef } from "react";
import { useData } from "../hooks/useData";
import { DashboardMain } from "./DashboardMain";
import { DashboardTopline } from "./DashboardTopline";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// controller
	const controller = useData();

	return (
		<div
			className={`w-full h-full flex flex-col max-w-lg rounded-xl bg-linear-to-bl from-background-2 to-background-1 ${className ?? ""}`}
		>
			<DashboardTopline controller={controller} />
			<DashboardMain controller={controller} />
		</div>
	);
};
