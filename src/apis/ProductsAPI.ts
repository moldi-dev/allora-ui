import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse, PageResponse, ProductResponse} from "@/types/responses.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {ProductFilterRequest} from "@/types/requests.ts";

async function getProductsInStockFn(page: number, size: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ProductResponse>>>(`/products/in-stock?page=${page}&size=${size}`);
        return response.data as HttpResponse<PageResponse<ProductResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetProductsInStockQuery = (page: number, size: number) => {
    return useQuery<HttpResponse<PageResponse<ProductResponse>> | ErrorResponse, Error>({
        queryFn: () => getProductsInStockFn(page, size),
        queryKey: ["getProductsInStock", page, size]
    });
};

async function getAllProductsFn(page: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ProductResponse>>>(`/products?page=${page}&size=9`);
        return response.data as HttpResponse<PageResponse<ProductResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllProductsQuery = (page: number) => {
    return useQuery<HttpResponse<PageResponse<ProductResponse>> | ErrorResponse, Error>({
        queryFn: () => getAllProductsFn(page),
        queryKey: ["getAllProducts", page]
    });
};

async function postProductFn(request: FormData) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<ProductResponse>>("/products", request);
        return response.data as HttpResponse<ProductResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePostProductMutation = () => {
    return useMutation<HttpResponse<ProductResponse> | ErrorResponse, Error, FormData>({
        mutationFn: postProductFn,
        mutationKey: ["postProduct"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function patchProductFn({id, request}: {id: number, request: FormData}) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<ProductResponse>>(`/products/id=${id}`, request);
        return response.data as HttpResponse<ProductResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePatchProductMutation = () => {
    return useMutation<HttpResponse<ProductResponse> | ErrorResponse, Error, {id: number, request: FormData}>({
        mutationFn: patchProductFn,
        mutationKey: ["patchProduct"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function deleteProductFn(id: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.delete<HttpResponse<null>>(`/products/id=${id}`);
        return response.data as HttpResponse<ProductResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useDeleteProductMutation = (id: number) => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error>({
        mutationFn: () => deleteProductFn(id),
        mutationKey: ["deleteProduct", id],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function getFilteredProductsFn(request: ProductFilterRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<PageResponse<ProductResponse>>>(`/products/all/filters?page=${request.page}&size=1`, request);
        return response.data as HttpResponse<PageResponse<ProductResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetFilteredProductsMutation = () => {
    return useMutation<HttpResponse<PageResponse<ProductResponse>> | ErrorResponse, Error, ProductFilterRequest>({
        mutationFn: getFilteredProductsFn,
        mutationKey: ["getFilteredProducts"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};