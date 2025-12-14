import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import Image from "next/image";
import downloadImg from "../../../public/download.svg";
import serverImg from "../../../public/server.svg";
import { useDashboardContext } from "../context/DashboardContext";
import type { useData } from "../hooks/useData";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardTopline = ({ controller }: Props) => {
	const [, dispatch] = useDashboardContext();

	return (
		<div className="w-full flex flex-col border-b border-b-background-4 px-2 py-1 items-center gap-2 flex-wrap">
			<div className="flex gap-1 w-full items-center">
				<Image src={serverImg} alt="" className="image" />
				<h3>Analytics client</h3>
				<Tooltip
					description="Hide dashboard"
					direction="top"
					className="ml-auto"
				>
					<Button
						onClick={() => dispatch({ type: "SET_VISIBLE", flag: false })}
					>
						<small>✕ Hide</small>
					</Button>
				</Tooltip>
			</div>
			<div className="flex gap-1 w-full items-center">
				<span className="flex gap-1.5 items-center">
					<div
						className={`rounded-full w-1.5 h-1.5 ${controller.data !== null ? "bg-[rgb(56,66,255)]" : "bg-red-500"} duration-1000`}
					/>
					{controller.data !== null ? "Synced" : "Fetching..."}
				</span>

				<div className="flex gap-1 ml-auto flex-wrap justify-center">
					<Tooltip description="Re-download database data">
						<Button onClick={controller.resync}>
							{controller.isSyncing.current === true && (
								<Spinner className="w-3! h-3!" />
							)}
							<Image className="image invert-70!" alt="" src={downloadImg} />
							<mark>Sync data</mark>
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
