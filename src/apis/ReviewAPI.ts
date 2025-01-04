import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {HttpResponse, PageResponse, ReviewResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {ReviewRequest} from "@/types/requests.ts";

async function getAllReviewsByProductId(id: number, page: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ReviewResponse>>>(`/reviews/product-id=${id}?page=${page}&size=3`);
        return response.data as HttpResponse<PageResponse<ReviewResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllReviewsByProductIdQuery = (id: number, page: number) => {
    return useQuery<HttpResponse<PageResponse<ReviewResponse>> | ErrorResponse, Error>({
        queryFn: () => getAllReviewsByProductId(id, page),
        queryKey: ["getAllReviewsByProductId", id, page]
    });
}

async function getAllReviewsFn(page: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<ReviewResponse>>>(`/reviews?page=${page}&size=6`);
        return response.data as HttpResponse<PageResponse<ReviewResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllReviewsQuery = (page: number) => {
    return useQuery<HttpResponse<PageResponse<ReviewResponse>> | ErrorResponse, Error>({
        queryFn: () => getAllReviewsFn(page),
        queryKey: ["getAllReviewsQuery", page]
    })
}

async function deleteReviewFn(id: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.delete<HttpResponse<null>>(`/reviews/id=${id}`);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useDeleteReviewMutation = (id: number) => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error>({
        mutationFn: () => deleteReviewFn(id),
        mutationKey: ["deleteReview", id],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function getCanAuthenticatedUserReviewProductFn(productId: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<boolean>>(`/reviews/authenticated/can-review/product-id=${productId}`);
        return response.data as HttpResponse<boolean>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetCanAuthenticatedUserReviewProduct = (productId: number) => {
    return useQuery<HttpResponse<boolean> | ErrorResponse, Error>({
        queryFn: () => getCanAuthenticatedUserReviewProductFn(productId),
        queryKey: ["canAuthenticatedUserReviewProduct", productId],
    })
}

async function postReviewFn(request: ReviewRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<ReviewResponse>>("/reviews", request);
        return response.data as HttpResponse<ReviewResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePostReviewMutation = () => {
    return useMutation<HttpResponse<ReviewResponse> | ErrorResponse, Error, ReviewRequest>({
        mutationFn: postReviewFn,
        mutationKey: ["postReview"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}