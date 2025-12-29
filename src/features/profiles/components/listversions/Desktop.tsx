import Image from "next/image";
import React from "react";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { Profiles } from "@/types/zustand/user";
import { relativeTime } from "@/utils/relativeTime";
import { useAppStore } from "@/zustand/store";
import { ProfileImage } from "@/features/profile/components/ProfileImage";

type Props = {
	profiles: Profiles;
};

export const Desktop = ({ profiles }: Props) => {
	// zustand state
	const friends = useAppStore((state) => state.friends);

	return (
		<ul className="flex flex-col gap-2">
			{Object.values(profiles).map(
				(data) =>
					(data.profile.visibility === "everyone" ||
						(data.profile.visibility === "friends" &&
							friends?.some((id) => id === data?.user.id))) && (
						<React.Fragment key={data.user.id}>
							<li className="flex w-full">
								<LinkButton
									className="flex flex-col w-full justify-start items-start p-2! gap-2"
									style={
										data.profile.color
											? { outline: `1px solid ${data.profile.color}` }
											: {}
									}
									href={`/profile/${data.user.username}`}
								>
									<div className="flex w-full gap-2 h-full">
										<ProfileImage
											profile={data.profile}
											width={64}
											height={64}
										/>

										<hr className="h-full! w-px! border-background-5!" />

										<ul className="flex w-full h-full gap-4">
											<li className="flex flex-col gap-1">
												<span>
													<small className="flex items-center gap-1">
														<Image
															src="/type.svg"
															width={16}
															height={16}
															alt=""
														/>
														Username
													</small>
												</span>
												<span>
													<b>{data.user.username}</b>
												</span>
											</li>

											<li className="flex flex-col gap-1">
												<span>
													<small className="flex items-center gap-1">
														<Image
															src="/eye.svg"
															width={16}
															height={16}
															alt=""
														/>
														Name
													</small>
												</span>
												<span>
													<b>
														<mark>{data.profile.name}</mark>
													</b>
												</span>
											</li>

											{data.profile.oneliner && (
												<li className="flex flex-col gap-1">
													<span>
														<small className="flex items-center gap-1">
															<Image
																src="/book.svg"
																width={16}
																height={16}
																alt=""
															/>
															One-liner
														</small>
													</span>
													<span>{data.profile.oneliner}</span>
												</li>
											)}

											<li className="flex flex-col gap-1 ml-auto!">
												<span>
													<small className="flex items-center gap-1">
														<Image
															src="/calendar.svg"
															width={16}
															height={16}
															alt=""
														/>
														Last seen
													</small>
												</span>
												<span>{relativeTime(data.user.last_seen_at)}</span>
											</li>
										</ul>
									</div>

									<hr className="border-background-5!" />
									<ul className="flex flex-col gap-2">
										{data.profile.bio && (
											<li className="flex flex-col">
												<span>
													<small className="flex items-center gap-1">
														<Image
															src="/type.svg"
															width={16}
															height={16}
															alt=""
														/>
														Bio
													</small>
												</span>
												<span>{data.profile.bio}</span>
											</li>
										)}

										{data.profile.status && (
											<li className="flex flex-col">
												<span>
													<small className="flex items-center gap-1">
														<Image
															src="/description.svg"
															width={16}
															height={16}
															alt=""
														/>
														Status
													</small>
												</span>
												<span>{data.profile.status}</span>
											</li>
										)}
									</ul>
								</LinkButton>
							</li>
							<hr />
						</React.Fragment>
					),
			)}
		</ul>
	);
};
