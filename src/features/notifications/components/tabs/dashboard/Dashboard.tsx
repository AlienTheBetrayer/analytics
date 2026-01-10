import { Display } from "./Display";
import { Topline } from "../../toplines/dashboard/Topline";

export const Dashboard = () => {
    return (
        <div className="flex flex-col gap-2">
            <Topline />
            <hr />
            <Display />
        </div>
    );
};
