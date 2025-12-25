"use client";
import { useParams } from "next/navigation";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";

export const Emulate = () => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

	// zustand states
	const data = useAppStore((state) => state.data);
	const status = useAppStore((state) => state.status);

	// error handling:
	// authentcation's missing
	if (
		status === null ||
		status?.isLoggedIn === false ||
		status?.user.role === "user"
	) {
		return (
			<div className="flex flex-col w-full max-w-64 m-auto box">
				<AuthRequired />
			</div>
		);
	}

	// no data fetched
	if (data === null) {
		return (
			<div className="flex flex-col w-full max-w-72 m-auto box">
				<FetchPrompt />
			</div>
		);
	}

	// data is fetched and project at the id is not fetched
	if (id !== undefined && data[id] === undefined) {
		return (
			<div className="flex flex-col w-full max-w-72 m-auto box">
				<FetchPrompt />
				<hr />
				<ProjectList data={data} />
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full max-w-lg box m-auto">
			<div className="flex flex-col gap-2">
				<div className="flex">
					<LinkButton href="/dashboard" className="ml-auto">
						✕ Go back
					</LinkButton>
				</div>
				<span className="text-center text-foreground-2! text-5! whitespace-nowrap">
					Project selection
				</span>
				<span className="text-center">
					Select a project first to emulate events / aggregates
				</span>
			</div>

			<hr />
			<ProjectList data={data} />

			{id !== undefined && (
				<>
					<hr />
					<Controller />
				</>
			)}
		</div>
	);
};
