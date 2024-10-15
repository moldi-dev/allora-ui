import {axiosInstance} from "@/constants.ts";

export async function fetchCsrfToken() {
    const response = await axiosInstance.get('/csrf');
    return response.data.token;
}