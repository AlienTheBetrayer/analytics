import type { AnalyticsMetaType } from "@/app/types/database";
import { relativeTime } from "@/utils/relativeTime";
import './DashboardEvent.css';

type Props = {
	event: AnalyticsMetaType;
};

export const DashboardEvent = ({ event }: Props) => {
	return (
		<li className="dashboard-events gap-3 bg-linear-to-r from-background-1 to-background-2 rounded-3xl outline-1 outline-background-4 px-4! py-2! hover:scale-105 hover:brightness-150 duration-300 transition-all">
			<EventProperty eventType="Type" value={event.type} />
			<EventProperty eventType="Description" value={event.description ?? ""}/>
			<EventProperty
				eventType="When"
				value={relativeTime(event.created_at)}
			/>
		</li>
	);
};

type PropertyProps = {
	eventType: string;
	value: string;
	className?: string;
};

const EventProperty = ({ eventType, value, className }: PropertyProps) => {
	return (
		<div className={`dashboard-event flex flex-col ${className ?? ""}`}>
			<span>
				<small>{eventType}</small>
			</span>
			<span>{value}</span>
		</div>
	);
};
