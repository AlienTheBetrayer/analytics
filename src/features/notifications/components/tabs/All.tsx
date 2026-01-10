import { Account } from "./account/Account";
import { Dashboard } from "./dashboard/Dashboard";

export const All = () => {
    return (
        <div className="flex flex-col md:grid grid-cols-2 gap-6">
            <Account />
            <Dashboard />
        </div>
    );
};
