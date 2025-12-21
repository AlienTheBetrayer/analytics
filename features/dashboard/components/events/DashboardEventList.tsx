"use client";
import { protectedRequest } from "@/app/utils/protectedRequest";
import type { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { useScroll } from "@/hooks/useScroll";
import { useState } from "react";
import type { useNotificationContext } from "../../context/NotificationContext";
import type { ProjectData, useData } from "../../hooks/useData";
import { DashboardEvent } from "./DashboardEvent";
import { DashboardScrollTop } from "./DashboardScrollTop";

type Props = {
	projectData: ProjectData;
	promises: ReturnType<typeof usePromiseStatus>;
	controller: ReturnType<typeof useData>;
	notifications: ReturnType<typeof useNotificationContext>;
};

export const DashboardEventList = ({
	projectData,
	promises,
	controller,
	notifications,
}: Props) => {
	const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
	const scroll = useScroll<HTMLUListElement>((value) => {
		setHasScrolledEnough(value > 0.5);
	});
	return (
		<ul
			ref={scroll.ref}
			className="relative! flex flex-col gap-2 max-h-58 overflow-y-scroll scheme-dark pb-4!"
			style={{
				maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
				scrollbarWidth: "thin",
			}}
		>
			<DashboardScrollTop
				isVisible={hasScrolledEnough}
				scrollRef={scroll.ref}
			/>
            
			{[...projectData.metaData].reverse().map((metaDataEntry) => (
				<DashboardEvent
					event={metaDataEntry}
					key={metaDataEntry.id}
					onDelete={(id) => {
						promises.wrap(metaDataEntry.id, () =>
							protectedRequest("/api/analytics/admin/delete-event", { id })
								.then(() => {
									controller.dispatch({ type: "DELETE_EVENT", id });
								})
								.catch(() => {
									notifications.show(
										{ type: "error", content: "Not authenticated." },

										false,
									);
								}),
						);
					}}
					isLoading={promises.get(metaDataEntry.id) === "pending"}
				/>
			))}
		</ul>
	);
};
