import axios from "axios";
import {fetchCsrfToken} from "@/apis/CSRFAPI.ts";

const BACKEND_BASE_PATH = "http://localhost:8080";
const BACKEND_BASE_API_PATH = `${BACKEND_BASE_PATH}/api/v1`;

export const GENERIC_ERROR_MESSAGE = "We're sorry, but an unexpected error has occurred. Please try again later or contact support if the issue persists";

export const RECAPTCHA_SITE_KEY = "6Ld0Uj4qAAAAAOe7jucWeXs7q9qO_nZouyaDbUmB";

export const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_API_PATH,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (["post", "patch", "delete"].includes(config.method.toLowerCase())) {
            config.headers["X-XSRF-TOKEN"] = await fetchCsrfToken();
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            //console.clear(); // TODO: uncomment the console clear once the API is completely developed
        }
        return Promise.reject(error);
    }
);

export async function awaitDeveloperTimeout() {
    return await new Promise(resolve => setTimeout(resolve, 500));
}