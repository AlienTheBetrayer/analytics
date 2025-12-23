"use client";
import { useScroll } from "@/src/hooks/useScroll";
import { useState } from "react";
import { DashboardEvent } from "./DashboardEvent";
import { DashboardScrollTop } from "./DashboardScrollTop";
import type { AnalyticsMeta } from "@/src/types/api/database";

type Props = {
	events: AnalyticsMeta[];
};

export const DashboardEventList = ({ events }: Props) => {
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

			{[...events].reverse().map((event) => (
				<DashboardEvent event={event} key={event.id} />
			))}
		</ul>
	);
};
