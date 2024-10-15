import {PasswordResetRequest, PasswordResetTokenRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse} from "@/types/responses.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

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