"use client";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

type Props = {
	id?: string | undefined;
};

export const Emulate = ({ id }: Props) => {
	return (
		<div className="box w-full max-w-64 m-auto">
			<_Emulate id={id} />
		</div>
	);
};

const _Emulate = ({ id }: Props) => {
	// zustand states
	const data = useAppStore((state) => state.data);
	const status = useAppStore((state) => state.status);
	const dataPromises = useAppStore((state) => state.dataPromises);

	// zustand functions
	const updateProjectList = useAppStore((state) => state.updateProjectList);

	// error handling
	// authentcation's missing
	if (
		status === null ||
		status?.isLoggedIn === false ||
		status?.role === "user"
	) {
		return (
			<div className="flex flex-col items-center">
				<span>Authentication is required.</span>
				<Spinner styles="big" />
			</div>
		);
	}

	if (data === null || (id !== undefined && data?.[id] === undefined)) {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						Fetch required
					</span>
					<span className="text-center">
						The project / data has not been fetched yet
					</span>
				</div>

				<hr />
				<div className="flex flex-col gap-2">
					<Button
						onClick={() => {
							updateProjectList();
						}}
					>
						{dataPromises?.projects === "pending" && <Spinner />}
						Fetch
					</Button>
					<LinkButton style="button" href="/dashboard">
						Go to dashboard
					</LinkButton>
				</div>
			</div>
		);
	}

	return (
        <div>
            {Object.values(data).map(project => (
                <div key={project.project?.name}>
                    {project.project?.name}
                </div>
            ))}
        </div>
    )
};
