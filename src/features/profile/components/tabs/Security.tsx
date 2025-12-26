import Image from "next/image";
import { useState } from "react";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { useAppStore } from "@/zustand/store";
import { redirect } from "next/navigation";

type Props = {
	data: { profile: Profile; user: User };
};

export const Security = ({ data }: Props) => {
	// zustand states
	const authenticationPromises = useAppStore(
		(state) => state.authenticationPromises,
	);

	// zustand functions
	const logout = useAppStore((state) => state.logout);
	const deleteUser = useAppStore((state) => state.deleteUser);
	const deleteProfileData = useAppStore((state) => state.deleteProfileData);

	// states
	const [password, setPassword] = useState<string>("");

	// messageBox
	const deleteMessageBox = usePopup(
		<MessageBox
			description="You are about to delete your account data forever!"
			onInteract={(res) => {
				deleteMessageBox.hide();
				if (res === "yes") {
                    deleteProfileData(data.user.id);
					deleteUser(data.user.id);
                    logout();
                    redirect("/home");
				}
			}}
		/>,
	);

	const terminateMessageBox = usePopup(
		<MessageBox
			description="You are about to log yourself out of all accounts on all devices!"
			onInteract={(res) => {
				terminateMessageBox.hide();
				if (res === "yes") {
					logout();
				}
			}}
		/>,
	);

	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			{deleteMessageBox.render()}
			{terminateMessageBox.render()}

			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Security & Authentication</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 sm:w-80">
					<div className="bg-blue-3 rounded-full w-full max-w-48 aspect-square" />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>

				<hr className="sm:w-px! sm:h-full" />
				<div className="flex flex-col gap-2 h-full w-full grow">
					<form
						className="flex flex-col gap-2"
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<label htmlFor="bio" className="flex justify-between">
							Password
							<small> (a new strong password)</small>
						</label>
						<Input
							value={password}
							onChange={(e) => setPassword(e)}
							placeholder="24 characters max"
							maxLength={24}
						/>

						<hr className="mt-auto" />
						<Button type="submit">
							{authenticationPromises?.password_change === "pending" && (
								<Spinner />
							)}
							<Image src="/send.svg" width={20} height={20} alt="" />
							Apply changes
						</Button>
					</form>
					<hr className="mt-auto" />
					<Tooltip
						description="Log yourself out of all sessions on all devices"
						direction="top"
						className="w-full"
					>
						<Button
							className="w-full"
							onClick={() => {
								terminateMessageBox.show();
							}}
						>
							{authenticationPromises?.logout === "pending" && <Spinner />}
							<Image src="/auth.svg" width={16} height={16} alt="" />
							Terminate sessions
						</Button>
					</Tooltip>
					<Tooltip
						description="Wipe your account data"
						direction="top"
						className="w-full"
					>
						<Button
							className="w-full"
							onClick={() => {
								deleteMessageBox.show();
							}}
						>
							{authenticationPromises?.delete === "pending" && <Spinner />}
							<Image src="/cross.svg" width={16} height={16} alt="" />
							Delete account
						</Button>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};
