import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/session";
//import { recipeDetails } from "../config";
import {  SignOutIcon } from "../assets/images";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import FlixshareApp from "./dashboard";
/*TODO 
celebrateIcon
*/
export interface Link {
    name: string;
    onClick: () => void;
    icon: string;
}

export default function Dashboard() {
    const sessionContext = useSessionContext();
    const navigate = useNavigate();

    if (sessionContext.loading === true) {
        return null;
    }

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    /*function openLink(url: string) {
        window.open(url, "_blank");
    }*/

    const links: Link[] = [
        {
            name: "Sign Out",
            onClick: logoutClicked,
            icon: SignOutIcon,
        },
    ];

    return (
        <div className="dashboard">
            <FlixshareApp />
            <Footer links={links} />
        </div>
    );
}
