import { useDashboardContext } from "@/features/dashboard/context/DashboardContext";
import type { useAuth } from "@/features/dashboard/hooks/useAuth";
import { DashboardAuthForm } from "./DashboardAuthForm";

type Props = {
	auth: ReturnType<typeof useAuth>;
};

export const LoginForm = ({ auth }: Props) => {
	const [, dashboardDispatch] = useDashboardContext();

	return (
		<DashboardAuthForm
			title="Logging in"
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
					text: "Login",
					tooltip: "Sign in your existing account",
					promiseKey: "login",
				},
			]}
			onHide={() => {
				dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
			}}
			onSubmit={() => {
				auth.onLogin();
			}}
			promises={auth.promiseStatus}
			ref={auth.formRef}
		/>
	);
};
