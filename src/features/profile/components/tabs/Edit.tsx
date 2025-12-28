import "./Edit.css";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type JSX, useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";
import { fileToBase64 } from "../../utils/fileToBase64";

type Props = {
	data: { profile: Profile; user: User };
};

export const Edit = ({ data }: Props) => {
	// zustand state
	const promises = useAppStore((state) => state.promises);
	const userStatus = useAppStore((state) => state.status);

	// zustand functions
	const setProfileData = useAppStore((state) => state.setProfileData);

	// input states
	const [status, setStatus] = useState<string>(data.profile.status ?? "");
	const [name, setName] = useState<string>(data.profile.name ?? "");
	const [bio, setBio] = useState<string>(data.profile.bio ?? "");
	const [oneliner, setOneliner] = useState<string>(data.profile.oneliner ?? "");
	const [color, setColor] = useState<string>(data.profile.color ?? "#000");

	// file uploading
	const [fileError, setFileError] = useState<JSX.Element | undefined>();
	const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);

	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Appearance editing</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 w-full sm:max-w-64">
					<span>{data.profile.name}</span>
					<div
						className="relative w-full max-w-48 aspect-square rounded-full overflow-hidden 
                    hover:scale-105 focus-within:scale-105 duration-300 ease-out"
					>
						{data.profile.avatar ? (
							<Image
								alt="avatar"
								src={data.profile.avatar}
								layout="fill"
								objectFit="cover"
								className="pointer-events-none grayscale-0! invert-0!"
							/>
						) : (
							<div className="rounded-full w-full h-full aspect-square bg-blue-3"></div>
						)}
						<span className="absolute inset-0 grid place-items-center m-auto mix-blend-difference text-5! text-white!">
							Upload an image
						</span>

						<label
							htmlFor="profile-avatar"
							className="absolute duration-300 ease-out transitionall border-4 border-transparent 
                            focus-within:border-blue-1 hover:border-blue-1 left-0 top-0 flex rounded-full w-full h-full aspect-square cursor-pointer z-100"
						>
							<input
								onChange={(e) => {
									if (!userStatus) return;

									const file = e.target.files?.[0];
									if (!file) return;

									// > 0.5 MB error handling
									if (file.size / 1024 / 1024 > 0.5) {
										setFileError(
											<>
												Size has to be
												<u> less </u>
												than{" "}
												<mark>
													<b>0.5 MB!</b>
												</mark>
											</>,
										);
										setTimeout(() => {
											setFileError(undefined);
										}, 10000);
										return;
									}

									setAvatarFile(file);
								}}
								id="profile-avatar"
								type="file"
								accept="image/*"
								className="absolute left-0 top-0 w-0 h-0 opacity-0"
							/>
						</label>
					</div>

					<AnimatePresence>
						{fileError && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="overflow-hidden"
							>
								<span>{fileError}</span>
							</motion.div>
						)}
					</AnimatePresence>

					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>

					{data.profile.avatar && (
						<Button onClick={() => {
                            setAvatarFile(undefined);
                        }}>
							<Image src="/cross.svg" width={16} height={16} alt="" />
							Delete image
						</Button>
					)}

					<hr className="mt-auto" />
					<label
						htmlFor="profile-color"
						className="flex justify-between items-center w-full"
					>
						Color
						<small> (everyone will see it)</small>
					</label>
					<input
						value={color}
						onChange={(e) => setColor(e.target.value)}
						id="profile-color"
						type="color"
						className="cursor-pointer w-full! h-12 outline-0"
					/>
				</div>

				<hr className="sm:w-px! sm:h-full" />
				<form
					className="flex flex-col gap-2 w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						if (!userStatus) return;

						let retAvatar = data.profile.avatar;
                        console.log(retAvatar);
						if (avatarFile !== undefined) {
							retAvatar = await fileToBase64(avatarFile);
						}

						setProfileData(data.user, {
							status,
							bio,
							oneliner,
							name,
							color,
							avatar: retAvatar,
							avatar_name: avatarFile?.name,
							avatar_type: avatarFile?.type,
						});
					}}
				>
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>Name</b>
						<small> (your name, can be fictional)</small>
					</label>
					<Input
						value={name}
						onChange={(e) => setName(e)}
						placeholder="24 characters max"
						maxLength={24}
					/>

					<hr />
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>One-liner</b>
						<small> (a short phrase that feels yours)</small>
					</label>
					<Input
						value={oneliner}
						onChange={(e) => setOneliner(e)}
						placeholder="24 characters max"
						maxLength={24}
					/>

					<hr />
					<label htmlFor="status" className="flex justify-between items-center">
						<b>Status</b>
						<small> (a short text capturing your mood)</small>
					</label>
					<Input
						id="status"
						value={status}
						onChange={(e) => setStatus(e)}
						maxLength={48}
						placeholder="48 characters max"
					/>

					<hr />
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>Bio</b>
						<small> (a long piece of text, describe yourself)</small>
					</label>
					<Input
						value={bio}
						onChange={(e) => setBio(e)}
						placeholder="128 characters max"
						maxLength={128}
					/>

					<hr className="mt-auto" />
					<Button type="submit">
						{promiseStatus(promises.profile_set)}
						<Image src="/send.svg" width={20} height={20} alt="" />
						Apply changes
					</Button>
				</form>
			</div>
		</div>
	);
};
