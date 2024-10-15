import {SignInRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse} from "@/types/responses.ts";
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

