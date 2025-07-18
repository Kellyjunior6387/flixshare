import ThirdParty, { Google, Github, Apple, Twitter } from "supertokens-auth-react/recipe/thirdparty";
import { ThirdPartyPreBuiltUI } from "supertokens-auth-react/recipe/thirdparty/prebuiltui";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 8000;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "FlixShare",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    style: `
        [data-supertokens~=container] {
            background: rgba(26, 26, 46, 0.6);
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 20px;
            padding: 2rem;
        }
        [data-supertokens~=headerTitle] {
            color: #ffffff;
            font-size: 2rem;
            font-weight: 700;
        }
        [data-supertokens~=providerButton] {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            border-radius: 12px;
        }
        [data-supertokens~=providerButtonText] {
            color: #ffffff;
        }
        [data-supertokens~=link] {
            color: #667eea;
        }
        [data-supertokens~=secondaryText] {
            color: rgba(255, 255, 255, 0.7);
        }
    `,
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init(),
        ThirdParty.init({
            signInAndUpFeature: {
                providers: [Github.init(), Google.init(), Apple.init(), Twitter.init()],
            },
        }),
        Session.init(),
    ],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/dashboard";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/thirdpartyemailpassword/introduction",
};

export const PreBuiltUIList = [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};
