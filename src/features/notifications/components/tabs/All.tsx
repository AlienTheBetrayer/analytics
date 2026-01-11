import Image from "next/image";
import { Account } from "./account/Account";
import { Dashboard } from "./dashboard/Dashboard";

export const All = () => {
    return (
        <div className="flex flex-col lg:grid grid-cols-2 gap-18 lg:gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center mx-auto gap-1">
                    <Image
                        alt="account-only"
                        width={16}
                        height={16}
                        src="/account.svg"
                    />
                    <span>Account</span>
                </div>
                <hr />
                <Account />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center mx-auto gap-1">
                    <Image
                        alt="dashboard-only"
                        width={16}
                        height={16}
                        src="/dashboard.svg"
                    />
                    <span>Dashboard</span>
                </div>
                <hr />
                <Dashboard />
            </div>
        </div>
    );
};
