import React from "react";
import { isAuthenticated } from "./tokenManager";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps{
    children: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ( {children}) => {
    if(!isAuthenticated()){
        return <Navigate to="/auth/login" />;
    }

    return <>{children}</>;
}
export default PrivateRoute