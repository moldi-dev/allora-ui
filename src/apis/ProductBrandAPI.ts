import {axiosInstance} from "@/constants.ts";
import {HttpResponse, PageResponse, ProductBrandResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useInfiniteQuery} from "@tanstack/react-query";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";

async function getAllProductBrandsFn({pageParam} : {pageParam: number}) {
    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ProductBrandResponse[]>>>(`/product-brands?page=${pageParam}&size=5`);
        return response.data as HttpResponse<PageResponse<ProductBrandResponse[]>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllProductBrandsInfiniteQuery = () => {
    return useInfiniteQuery({
        queryFn: getAllProductBrandsFn,
        queryKey: ["getAllProductBrands"],
        initialPageParam: 0,
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (isHttpResponse(lastPage) && isPageResponse(lastPage.body) && lastPage.body.content.length === 0) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        getPreviousPageParam: (_, __, firstPageParam) => {
            if (firstPageParam <= 1) {
                return undefined;
            }
            return firstPageParam - 1;
        }
    })
}