import {axiosInstance} from "@/constants.ts";
import {HttpResponse, ProductSizeResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

async function getAllProductSizesFn() {
    try {
        const response = await axiosInstance.get<HttpResponse<ProductSizeResponse[]>>("/product-sizes");
        return response.data as HttpResponse<ProductSizeResponse[]>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllProductSizesQuery = () => {
    return useQuery<HttpResponse<ProductSizeResponse[]> | ErrorResponse, Error>({
        queryFn: getAllProductSizesFn,
        queryKey: ["getAllProductSizes"],
    })
}