import "./DashboardEvent.css";

import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import type { AnalyticsMeta } from "@/types/api/database/analytics";
import { relativeTime } from "@/utils/relativeTime";

type Props = {
	event: AnalyticsMeta;
};

export const DashboardEvent = ({ event }: Props) => {
	return (
		<Tooltip
			description={event.description ?? "No description"}
			title={event.type}
			direction="top"
		>
			<li
				className="sm:h-16 dashboard-event relative gap-3 bg-linear-to-r from-background-1 to-background-2 rounded-3xl
            border-2 border-background-4 
            px-4! py-2! hover:brightness-200 duration-300 ease-out transition-all"
			>
				<div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
					<span className={`text-5xl! opacity-30 transition-all duration-300 ease-out`}>
						<small>{event.type[0].toUpperCase()}</small>
					</span>
				</div>

				<EventProperty eventType="Type" value={event.type} image="/type.svg" />
				<EventProperty
					eventType="Description"
					value={event.description ?? "No description"}
					image="/description.svg"
				/>
				<EventProperty
					eventType="When"
					value={relativeTime(event.created_at)}
					image="/calendar.svg"
				/>

				<Tooltip
					description="Delete this event"
					className="w-full"
					direction="left"
				>
					<Button className="w-full">Delete</Button>
				</Tooltip>
			</li>
		</Tooltip>
	);
};

type PropertyProps = {
	eventType: string;
	value: string;
	className?: string;
	image?: string;
};

const EventProperty = ({
	eventType,
	value,
	image,
	className,
}: PropertyProps) => {
	return (
		<div className={`dashboard-event-element flex flex-col ${className ?? ""}`}>
			<span>
				<small className="flex items-center gap-1">
					{image && <Image alt="" src={image} width={16} height={16} />}
					{eventType}
				</small>
			</span>
			<span>{value}</span>
		</div>
	);
};
