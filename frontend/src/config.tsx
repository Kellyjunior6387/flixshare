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

export function getRoomBackendUrl() {
    return import.meta.env.VITE_ROOM_BACKEND_URL || 'http://localhost:8080';
}

export function getAuthBackendUrl() {
    return import.meta.env.VITE_AUTH_BACKEND_URL || 'http://localhost:8000';
}

export function getSupertokensUrl() {
    return import.meta.env.VITE_SUPERTOKENS_URL || 'http://localhost:3567';
}
