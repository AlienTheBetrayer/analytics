import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import type { useAuth } from "@/features/dashboard/hooks/useAuth";
import { DashboardAuthForm } from "./DashboardAuthForm";

type Props = {
	auth: ReturnType<typeof useAuth>;
};

export const RegisterForm = ({ auth }: Props) => {
	const [, dashboardDispatch] = useDashboardContext();

	return (
		<DashboardAuthForm
			title="Account creation"
			inputs={[
				{
					placeholder: "Username",
					value: auth.data.username ?? "",
					onChange: (value) => auth.onUsernameChange(value),
				},
				{
					placeholder: "Password",
					value: auth.data.password ?? "",
					onChange: (value) => auth.onPasswordChange(value),
					type: "password",
				},
			]}
			buttons={[
				{
					text: "Register",
					tooltip: "Create a new account",
					promiseKey: "register",
				},
			]}
			onHide={() => {
				dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
			}}
			onSubmit={() => {
				auth.onRegister();
			}}
			promises={auth.promiseStatus}
			status={auth.status}
			ref={auth.formRef}
		/>
	);
};
