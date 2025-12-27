import Image from "next/image";
import React from "react";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profiles } from "@/types/zustand/user";

type Props = {
	profiles: Profiles;
};

export const Desktop = ({ profiles }: Props) => {
	return (
		<ul className="flex flex-col gap-2">
			{Object.values(profiles).map((data) => (
				<React.Fragment key={data.user.id}>
					<li className="flex w-full">
						<LinkButton
							className="flex flex-col w-full justify-start items-start p-2! gap-2"
							href={`/profile/${data.user.username}`}
						>
							<div className="flex w-full gap-2 h-full">
								<div className="bg-blue-3 rounded-full w-20 aspect-square" />

								<hr className="h-full! w-px! border-background-5!" />

								<ul className="grid grid-cols-3 w-full h-full">
									<li className="flex flex-col gap-1">
										<span>
											<small className="flex items-center gap-1">
												<Image src="/type.svg" width={16} height={16} alt="" />
												Name
											</small>
										</span>
										<span>{data.profile.name}</span>
									</li>
								</ul>
							</div>

							<hr className="border-background-5!" />
							<div className="flex">
								<div className="flex flex-col gap-1">
									<span>
										<small className="flex items-center gap-1">
											<Image src="/type.svg" width={16} height={16} alt="" />
											Status
										</small>
									</span>
									<span>{data.profile.status}</span>
								</div>
							</div>
						</LinkButton>
					</li>
					<hr />
				</React.Fragment>
			))}
		</ul>
	);
};
