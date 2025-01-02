import {PasswordChangeRequest, PasswordResetRequest, PasswordResetTokenRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse, PageResponse, UserResponse} from "@/types/responses.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";

async function getAllUsersFn(page: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.get<HttpResponse<PageResponse<UserResponse>>>(`/users?page=${page}&size=3`);
        return response.data as HttpResponse<PageResponse<UserResponse>>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAllUsersQuery = (page: number) => {
    return useQuery<HttpResponse<PageResponse<UserResponse>> | ErrorResponse, Error>({
        queryFn: () => getAllUsersFn(page),
        queryKey: ["getAllUsers", page]
    });
}

async function passwordResetTokenFn(request: PasswordResetTokenRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<null>>("/users/request-password-reset-code", request);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePasswordResetTokenMutation = () => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error, PasswordResetTokenRequest>({
        mutationFn: passwordResetTokenFn,
        mutationKey: ["passwordResetToken"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function passwordResetFn(request: PasswordResetRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<null>>("/users/reset-password", request);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePasswordResetMutation = () => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error, PasswordResetRequest>({
        mutationFn: passwordResetFn,
        mutationKey: ["passwordReset"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function getAuthenticatedUserDataFn() {
    try {
        const response = await axiosInstance.get<HttpResponse<UserResponse>>("/users/authenticated");
        return response.data as HttpResponse<UserResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useGetAuthenticatedUserDataQuery = () => {
    return useQuery<HttpResponse<UserResponse> | ErrorResponse, Error>({
        queryFn: getAuthenticatedUserDataFn,
        queryKey: ["getAuthenticatedUserData"]
    });
};

async function deleteUserIdFn(id: number) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.delete<HttpResponse<null>>(`/users/id=${id}`);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useDeleteUserMutation = (id: number) => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error>({
        mutationFn: () => deleteUserIdFn(id),
        mutationKey: ["deleteUserById", id],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}

async function patchAuthenticatedUserPasswordFn(request: PasswordChangeRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<null>>("/users/authenticated/change-password", request);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePatchAuthenticatedUserPasswordMutation = () => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error, PasswordChangeRequest>({
        mutationFn: patchAuthenticatedUserPasswordFn,
        mutationKey: ["patchAuthenticatedUserPassword"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}