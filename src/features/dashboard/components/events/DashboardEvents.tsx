import { useState } from "react";
import { Spinner } from "@/features/spinner/components/Spinner";
import { useScroll } from "@/hooks/useScroll";
import { useAppStore } from "@/zustand/store";
import { DashboardEventList } from "./DashboardEventList";
import { DashboardScrollTop } from "./DashboardScrollTop";

export const DashboardEvents = () => {
	// zustand
	const data = useAppStore((state) => state.data);
	const selectedProjectId = useAppStore((state) => state.selectedProjectId);

	// scroll
	const [hasScrolledEnough, setHasScrolledEnough] = useState<boolean>(false);
	const scroll = useScroll<HTMLUListElement>((value) => {
		setHasScrolledEnough(value > 0.5);
	});

	// error / empty data handling
	if (data === null) return null;

	if (selectedProjectId === null) {
		return <span className="m-auto">Select a project to see events.</span>;
	}

	if (data?.[selectedProjectId].events === undefined) {
		return <Spinner styles="big" />;
	}

	if (data[selectedProjectId].events.length === 0) {
		return (
			<div className="flex h-64 max-h-64 relative">
				<span className="m-auto">
					No <u>events</u> so far...
				</span>
				<span className="m-auto absolute text-[14rem]! left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<small>?</small>
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 max-h-64 relative">
			<span className="sm:text-center text-5!">
				{data[selectedProjectId].project?.name}
				{"'s"} events
			</span>

			<DashboardEventList
				events={data[selectedProjectId].events}
				scrollRef={scroll.ref}
			/>

			<DashboardScrollTop
				isVisible={hasScrolledEnough}
				scrollRef={scroll.ref}
			/>
		</div>
	);
};
