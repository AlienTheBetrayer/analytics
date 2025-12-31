import "./Edit.css";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type JSX, useState } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";
import { fileToBase64 } from "../../utils/fileToBase64";
import { Colors } from "../modals/Colors";
import { ProfileImage } from "../ProfileImage";

type Props = {
	data: { profile: Profile; user: User };
};

export const Edit = ({ data }: Props) => {
	// zustand state
	const promises = useAppStore((state) => state.promises);
	const userStatus = useAppStore((state) => state.status);

	// zustand functions
	const setProfileData = useAppStore((state) => state.setProfileData);
	const getColors = useAppStore((state) => state.getColors);

	// input states
	const [status, setStatus] = useState<string>(data.profile.status ?? "");
	const [name, setName] = useState<string>(data.profile.name ?? "");
	const [bio, setBio] = useState<string>(data.profile.bio ?? "");
	const [oneliner, setOneliner] = useState<string>(data.profile.oneliner ?? "");

	// file uploading
	const [fileError, setFileError] = useState<JSX.Element | undefined>();
	const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
	const [avatar, setAvatar] = useState<string>(data.profile.avatar ?? "");

	// if we select an image - show an image - otherwise show the profile
	const avatarImage = avatarFile ? URL.createObjectURL(avatarFile) : avatar;

	// messageboxes
	const deleteAvatarMessageBox = usePopup(({hide}) =>
		<MessageBox
			description="After you click Apply Changes your account will no longer have a profile picture until you set it again"
			onInteract={(res) => {
                hide();
				if (res === "yes") {
					setAvatarFile(undefined);
					setAvatar("");
				}
			}}
		/>,
	);

	return (
		<div className="flex flex-col gap-4 p-4 w-full">
			{deleteAvatarMessageBox.render()}
			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					&apos;s profile
				</span>
				<span>Appearance editing</span>
			</div>

			<hr />
			<div className="flex flex-col md:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 w-full md:max-w-96">
					<span>{data.profile.name}</span>
					<div
						style={{
							borderColor: data.profile.color,
						}}
						className="profile-frame relative w-full max-w-64 aspect-square rounded-full overflow-hidden 
                    duration-300 ease-out"
					>
						<ProfileImage
							src={avatarImage}
							width={256}
							height={256}
							profile={data.profile}
						/>

						<label
							htmlFor="profile-avatar"
							className="absolute duration-300 ease-out transition-all border-4 border-transparent 
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

					<div className="flex gap-1">
						{avatarFile ? (
							<Button
								onClick={() => {
									setAvatarFile(undefined);
								}}
							>
								<Image src="/cross.svg" width={16} height={16} alt="" />
								Cancel
							</Button>
						) : (
							avatar && (
								<Button
									onClick={() => {
										deleteAvatarMessageBox.show();
									}}
								>
									<Image src="/delete.svg" width={16} height={16} alt="" />
									Delete image
								</Button>
							)
						)}
					</div>

					<hr className="mt-auto" />
					<Tooltip
						direction="top"
						element={<Colors />}
                        className='w-full'
                        type='modal'
                        disabledPointer={false}
					>
						<Button
							className="w-full!"
							onClick={() => {
								if (userStatus) {
									getColors(userStatus.user.id);
								}
							}}
						>
							<Image width={16} height={16} alt="" src="/cube.svg" />
							Color panel
						</Button>
					</Tooltip>
				</div>

				<hr className="sm:w-px! sm:h-full" />
				<form
					className="flex flex-col gap-2 w-full"
					onSubmit={async (e) => {
						e.preventDefault();
						if (!userStatus) return;

						let dataAvatar = avatar;
						if (avatarFile !== undefined) {
							dataAvatar = await fileToBase64(avatarFile);
						}

						setProfileData(data.user.id, {
							status,
							bio,
							oneliner,
							name,
							avatar: dataAvatar,
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
