import Image from "next/image";
import { Account } from "./account/Account";
import { Dashboard } from "./dashboard/Dashboard";

export const All = () => {
    return (
        <div className="flex flex-col md:grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <Image
                    alt="account-only"
                    width={16}
                    height={16}
                    src="/account.svg"
                    className="mx-auto"
                />
                <hr />
                <Account />
            </div>
            <div className="flex flex-col gap-2">
                <Image
                    alt="dashboard-only"
                    width={16}
                    height={16}
                    src="/dashboard.svg"
                    className="mx-auto"
                />
                <hr />
                <Dashboard />
            </div>
        </div>
    );
};
