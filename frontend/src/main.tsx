import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import SuperTokens from "supertokens-auth-react";
import { SuperTokensConfig } from "./config";

SuperTokens.init(SuperTokensConfig);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
