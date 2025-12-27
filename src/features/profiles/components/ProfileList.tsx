"use client";

import React, { useEffect } from "react";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

export const ProfileList = () => {
	// zustand state
	const profiles = useAppStore((state) => state.profiles);
	const promises = useAppStore((state) => state.promises);

	// zustand functions
	const getAllProfiles = useAppStore((state) => state.getAllProfiles);

	useEffect(() => {
		getAllProfiles();
	}, [getAllProfiles]);

	if (profiles === undefined || promises?.profiles === "pending") {
		return (
			<div className="flex flex-col w-full max-w-lg box m-auto">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<span className="text-center text-foreground-2! text-5!">
							Fetching profiles...
						</span>
						<span className="text-center">Wait until they all load</span>
					</div>

					<hr />
					<div className="flex flex-col gap-2 items-center justify-center">
						<span>
							If something went wrong - click this button to attempt to fix it.
						</span>
						<Button
							onClick={() => {
								getAllProfiles(false);
							}}
						>
							Re-fetch
						</Button>
					</div>
					<Spinner styles="big" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full max-w-lg box m-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						Profiles
					</span>
					<span className="text-center">
						All the profiles that you can see are here
					</span>
				</div>
				<hr />
				<ul className="flex flex-col gap-2">
					{Object.values(profiles).map((data) => (
						<React.Fragment key={data.user.id}>
							<li className="flex w-full">
								<LinkButton
									className="flex w-full justify-start p-2! gap-2"
									href={`/profile/${data.user.username}`}
								>
									<div className="bg-blue-3 rounded-full h-16 aspect-square" />
									<ul className="grid grid-rows-3 w-full">
										<li className="flex gap-2">
                                            {data.profile.name}
                                        </li>
										<li className="flex gap-2">
                                            
                                        </li>
										<li className="flex gap-2"></li>
									</ul>
								</LinkButton>
							</li>
							<hr />
						</React.Fragment>
					))}
				</ul>
			</div>
		</div>
	);
};
