import type { AnalyticsMetaType } from "@/app/types/database";
import { relativeTime } from "@/utils/relativeTime";
import "./DashboardEvent.css";

import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import calendarImg from "../../../../public/calendar.svg";
import descriptionImg from "../../../../public/description.svg";
import typeImg from "../../../../public/type.svg";

type Props = {
	event: AnalyticsMetaType;
	onDelete?: (id: string) => void;
};

export const DashboardEvent = ({ event, onDelete }: Props) => {
	return (
		<Tooltip
			description={event.description ?? "No description"}
			title={event.type}
			direction="inside"
			element={
				<Tooltip description="Delete this event" direction="top">
					<Button onClick={() => onDelete?.(event.id)}>Delete</Button>
				</Tooltip>
			}
		>
			<li className="dashboard-events gap-3 bg-linear-to-r from-background-1 to-background-2 rounded-3xl outline-1 outline-background-4 px-4! py-2! hover:brightness-200 hover:scale-102 duration-300 transition-all">
				<EventProperty eventType="Type" value={event.type} image={typeImg} />
				<EventProperty
					eventType="Description"
					value={event.description ?? ""}
					image={descriptionImg}
				/>
				<EventProperty
					eventType="When"
					value={relativeTime(event.created_at)}
					image={calendarImg}
				/>
				<Button
					className="delete-event-button"
					onClick={() => onDelete?.(event.id)}
				>
					Delete
				</Button>
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
		<div className={`dashboard-event flex flex-col ${className ?? ""}`}>
			<span>
				<small className="flex items-center gap-1">
					{image && <Image className="image invert-70!" alt="" src={image} />}

					{eventType}
				</small>
			</span>
			<span>{value}</span>
		</div>
	);
};
