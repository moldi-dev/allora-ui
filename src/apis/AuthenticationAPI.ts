import {SignInRequest, SignUpRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse, UserResponse} from "@/types/responses.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

async function signInFn(request: SignInRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<null>>("/authentication/sign-in", request);
        return response.data as HttpResponse<null>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useSignInMutation = () => {
    return useMutation<HttpResponse<null> | ErrorResponse, Error, SignInRequest>({
        mutationFn: signInFn,
        mutationKey: ["signIn"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function signUpFn(request: SignUpRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<null>>("/authentication/sign-up", request);
        return response.data as HttpResponse<UserResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useSignUpMutation = () => {
    return useMutation<HttpResponse<UserResponse> | ErrorResponse, Error, SignInRequest>({
        mutationFn: signUpFn,
        mutationKey: ["signUp"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

