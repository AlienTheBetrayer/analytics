"use client";
import { useEffect } from "react";
import { useAppStore } from "@/zustand/store";
import { useEmulateContext } from "../context/EmulateContext";
import { AuthRequired } from "./AuthRequired";
import { FetchPrompt } from "./FetchPrompt";
import { ProjectList } from "./ProjectList";

type Props = {
	id?: string | undefined;
};

export const Emulate = ({ id }: Props) => {
	// zustand states
	const data = useAppStore((state) => state.data);
	const status = useAppStore((state) => state.status);

	// internal context
	const [emulateData, setEmulateData] = useEmulateContext();

	// setting selected project to current id if it exists
	useEffect(() => {
		if (id !== undefined) {
			setEmulateData((prev) => ({ ...prev, selectedProjectId: id }));
		}
	}, [id, setEmulateData]);

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

	if (data === null || (id !== undefined && data?.[id] === undefined)) {
		return (
			<div className="flex flex-col w-full max-w-64 m-auto box">
				<FetchPrompt />
				{data !== null && (
					<>
						<hr />

						<ProjectList data={data} />
					</>
				)}
			</div>
		);
	}

	if (data !== null && id === undefined) {
		return <ProjectList data={data} />;
	}

	if (data !== null && id !== undefined && data[id] !== undefined) {
		return (
			<div className="flex flex-col gap-4 w-full max-w-lg box m-auto">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						Emulation
					</span>
					<span className="text-center">
						Emulate events / aggregates without having to send an event
					</span>
				</div>
				<hr />
				<ProjectList data={data} />
				<hr />
			</div>
		);
	}
};
