
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



    return (
        <div className="dashboard">
            <FlixshareApp />
        </div>
    );
}
