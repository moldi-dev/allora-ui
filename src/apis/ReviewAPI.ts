import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {HttpResponse, PageResponse, ReviewResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";

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