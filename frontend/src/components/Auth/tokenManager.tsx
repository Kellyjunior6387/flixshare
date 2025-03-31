import axios from "axios";

//const API_URL = 'http://localhost:8000/auth';

export const setAuthToken = (token: string) => {
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token)
    }
    else{
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
    }
}
export const getAuthToken = () => {
    return localStorage.getItem('token');
} 
export const isAuthenticated = () => {
    return !!getAuthToken();
}
export const logout = () => {
    setAuthToken('');
}