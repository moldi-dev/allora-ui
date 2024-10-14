import {axiosInstance} from "@/constants.tsx";

export async function fetchCsrfToken() {
    const response = await axiosInstance.get('/csrf');
    return response.data.token;
}