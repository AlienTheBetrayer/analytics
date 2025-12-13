"use client";
import { useNotification } from "@/features/notification/hooks/useNotification";
import type { ComponentPropsWithoutRef } from "react";
import { useData } from "../hooks/useData";
import { DashboardMain } from "./DashboardMain";
import { DashboardTopline } from "./DashboardTopline";

type Props = {} & ComponentPropsWithoutRef<"div">;

export const Dashboard = ({ className }: Props) => {
	// misc (notifications)
	const notifications = useNotification({ content: "", type: "error" });

	// controller
	const controller = useData({
		onSync: () => {
			notifications.show({
				type: "information",
				content: "Successfully synced data!",
			});
		},
		onError: (message: string) => {
			notifications.show({ type: "information", content: message }, false);
		},
	});

	return (
		<div
			className={`w-full h-full flex flex-col max-w-lg rounded-xl bg-linear-to-bl from-background-2 to-background-1 ${className ?? ""}`}
		>
			{notifications.render()}
			<DashboardTopline controller={controller} />
			<DashboardMain controller={controller} />
		</div>
	);
};
