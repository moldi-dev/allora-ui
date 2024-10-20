import {axiosInstance} from "@/constants.ts";
import {HttpResponse, PageResponse, ProductCategoryResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useInfiniteQuery} from "@tanstack/react-query";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";

async function getAllProductCategoriesFn({pageParam} : {pageParam: number}) {
    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ProductCategoryResponse[]>>>(`/product-categories?page=${pageParam}&size=5`);
        return response.data as HttpResponse<PageResponse<ProductCategoryResponse[]>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllProductCategoriesInfiniteQuery = () => {
    return useInfiniteQuery({
        queryFn: getAllProductCategoriesFn,
        queryKey: ["getAllProductCategories"],
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