import type { AnalyticsMetaType } from "@/app/types/database";
import { relativeTime } from "@/utils/relativeTime";
import "./DashboardEvent.css";

import { Tooltip } from "@/features/tooltip/components/Tooltip";
import Image from "next/image";
import calendarImg from "../../../../public/calendar.svg";
import descriptionImg from "../../../../public/description.svg";
import typeImg from "../../../../public/type.svg";

type Props = {
	event: AnalyticsMetaType;
};

export const DashboardEvent = ({ event }: Props) => {
	return (
		<Tooltip description={event.description ?? "No description"} title={event.type} direction="top">
			<li className="dashboard-events gap-3 bg-linear-to-r from-background-1 to-background-2 rounded-3xl outline-1 outline-background-4 px-4! py-2! hover:scale-105 hover:brightness-175 duration-300 transition-all">
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
