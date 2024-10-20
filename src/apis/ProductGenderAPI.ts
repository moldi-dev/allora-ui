import {axiosInstance} from "@/constants.ts";
import {HttpResponse, ProductGenderResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

async function getAllProductGendersFn() {
    try {
        const response = await axiosInstance.get<HttpResponse<ProductGenderResponse[]>>(`/product-genders`);
        return response.data as HttpResponse<ProductGenderResponse[]>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllProductGendersQuery = () => {
    return useQuery<HttpResponse<ProductGenderResponse[]> | ErrorResponse>({
        queryFn: getAllProductGendersFn,
        queryKey: ["getAllProductGenders"],
    })
}