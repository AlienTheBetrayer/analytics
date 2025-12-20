import { usePopup } from "@/features/popup/hooks/usePopup";
import { useCallback, useEffect } from "react";
import { LoginForm } from "../components/auth/forms/LoginForm";
import { LogoutMessageBox } from "../components/auth/forms/LogoutMessageBox";
import { RegisterForm } from "../components/auth/forms/RegisterForm";
import { useDashboardContext } from "../context/DashboardContext";
import type { useAuth } from "./useAuth";

export const useAuthForms = (auth: ReturnType<typeof useAuth>) => {
	const [dashboardState, dashboardDispatch] = useDashboardContext();

	const registerForm = usePopup(<RegisterForm auth={auth} />, () => {
		dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
	});

	const loginForm = usePopup(<LoginForm auth={auth} />, () => {
		dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
	});

	const logOutForm = usePopup(<LogoutMessageBox auth={auth} />, () => {
		dashboardDispatch({ type: "AUTH_FORM_SET", flag: null });
	});

	useEffect(() => {
		switch (dashboardState.authForm) {
			case "register":
				registerForm.show();
				break;
			case "login":
				loginForm.show();
				break;
			case "logout":
				logOutForm.show();
				break;
			case null:
				registerForm.hide();
				loginForm.hide();
				logOutForm.hide();
                auth.clearData();
				break;
		}
	}, [
		dashboardState.authForm,
		registerForm.show,
		registerForm.hide,
		loginForm.hide,
		loginForm.show,
		logOutForm.hide,
		logOutForm.show,
        auth.clearData
	]);

	const render = useCallback(() => {
		return (
			<>
				{registerForm.render()}
				{loginForm.render()}
				{logOutForm.render()}
			</>
		);
	}, [registerForm, loginForm, logOutForm]);

	return {
		render,
	};
};
