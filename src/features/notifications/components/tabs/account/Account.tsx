import { Display } from "./Display";
import { Topline } from "../../toplines/account/Topline";

export const Account = () => {
    return (
        <div className="flex flex-col gap-2">
            <Topline />
            <hr />
            <Display />
        </div>
    );
};
