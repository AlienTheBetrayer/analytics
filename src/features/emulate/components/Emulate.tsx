"use client";
import { useParams } from "next/navigation";
import { useAppStore } from "@/zustand/store";
import { AuthRequired } from "./AuthRequired";
import { Controller } from "./Controller";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";

export const Emulate = () => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

	// zustand states
	const data = useAppStore((state) => state.data);
	const status = useAppStore((state) => state.status);

	// error handling
	// authentcation's missing
	if (
		status === null ||
		status?.isLoggedIn === false ||
		status?.role === "user"
	) {
		return (
			<div className="flex flex-col w-full max-w-64 m-auto box">
				<AuthRequired />
			</div>
		);
	}

	/*
        1. data is not available / id is defined but project is not available:
            other projects list
            refetch prompt
        2. data is available & id is defined and project is available 
            show project data + emulation
            other projects list
        3. data is available yet id is undefined 
            show other projects list
    */

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
				<span className="text-center text-foreground-2! text-5!">
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
