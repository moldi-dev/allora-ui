import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {HttpResponse, OrderResponse, PageResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {OrderRequest} from "@/types/requests.ts";
import {toast} from "sonner";

async function placeOrderFn(request: OrderRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<string>>("/orders", request);
        return response.data as HttpResponse<string>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePlaceOrderMutation = () => {
    return useMutation<HttpResponse<string> | ErrorResponse, Error, OrderRequest>({
        mutationFn: placeOrderFn,
        mutationKey: ["placeOrder"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}

async function getAuthenticatedUserOrdersFn(page: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<OrderResponse>>>(`/orders/authenticated?page=${page}&size=3`);
        return response.data as HttpResponse<PageResponse<OrderResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAuthenticatedUserOrdersQuery = (page: number) => {
    return useQuery<HttpResponse<PageResponse<OrderResponse>> | ErrorResponse>({
        queryFn: () => getAuthenticatedUserOrdersFn(page),
        queryKey: ["getAuthenticatedUserOrders", page],
    })
}

async function payPendingOrderFn(orderId: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<string>>(`/orders/pending/id=${orderId}`);
        return response.data as HttpResponse<string>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePayPendingOrderMutation = () => {
    return useMutation<HttpResponse<string> | ErrorResponse, Error, number>({
        mutationFn: payPendingOrderFn,
        mutationKey: ["payPendingOrder"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}