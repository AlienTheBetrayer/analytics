// authForm
export type DashboardAuthForm = {
	type: "register" | "login" | "logout";
	username?: string;
	password?: string;
};

// notifications
export type DashboardNotificationType = "information" | "error" | "warning";

export type DashboardNotification = {
	status: DashboardNotificationType;
	title: string;
	description?: string;
	createdAt?: Date;
};

// the main type
export type DashboardStore = {
	// selectedProject
	selectedProjectId: string | null;

	/**
	 * Sets the currently selected project
	 * @param idx a uuid of the project
	 */
	selectProject: (idx: string | null) => void;

	/**
	 * explicitly deselects a project that may have been selected
	 */
	deselectProject: () => void;

	// notifications
	notifications: DashboardNotification[];

	/**
	 * explicitly sets notifications array
	 * @param notifications an array of notifications
	 */
	setNotifications: (notifications: DashboardNotification[]) => void;

	/**
	 * explicitly clears all notifications that have been sent
	 */
	clearNotifications: () => void;

	/**
	 * pushes a new notification into an existing array of notifications
	 * @param notification a new notification
	 */
	pushNotification: (notification: DashboardNotification) => void;
};
