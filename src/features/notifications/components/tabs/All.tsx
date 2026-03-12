import { Account } from "./account/Account";
import { Dashboard } from "./dashboard/Dashboard";

export const All = () => {
    return (
        <div className="flex flex-col lg:grid grid-cols-2 gap-4 grow">
            <Account />
            <Dashboard />
        </div>
    );
};
