import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import type { useAuth } from "@/features/dashboard/hooks/useAuth";
import { MessageBox } from "@/features/messagebox/components/MessageBox";

type Props = {
	auth: ReturnType<typeof useAuth>;
};

export const LogoutMessageBox = ({ auth }: Props) => {
	const [, dashboardDispatch] = useDashboardContext();

	return (
		<MessageBox
			title="Are you sure?"
			description="You are about to sign yourself out of all accounts and sessions!"
			onInteract={(res) => {
				if (res === "yes") {
					auth.onLogout();
				}
				dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
			}}
		/>
	);
};
