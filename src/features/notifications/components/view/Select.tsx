import { useParams } from "next/navigation";
import { Account } from "../tabs/account/Account";
import { Dashboard } from "../tabs/dashboard/Dashboard";

export const Select = () => {
    const { tab } = useParams<{ tab?: string }>();

    switch (tab) {
        default:
        case "dashboard":
            return <Dashboard />;
        case "account":
            return <Account />;
    }
};
