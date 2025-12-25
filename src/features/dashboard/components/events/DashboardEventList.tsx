"use client";
import type { AnalyticsMeta } from "@/types/api/database/analytics";
import { DashboardEvent } from "./DashboardEvent";

type Props = {
	events: AnalyticsMeta[];
	scrollRef: React.RefObject<HTMLUListElement | null>;
};

export const DashboardEventList = ({ events, scrollRef }: Props) => {
	return (
		<ul
			ref={scrollRef}
			className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark"
			style={{
				scrollbarWidth: "thin",
			}}
		>
			{[...events].reverse().map((event) => (
				<DashboardEvent event={event} key={event.id} />
			))}
		</ul>
	);
};
