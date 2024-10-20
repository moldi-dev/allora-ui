import {UserPersonalInformationRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {ErrorResponse, HttpResponse, UserPersonalInformationResponse} from "@/types/responses.ts";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

async function patchUserInformationFn({id, request}: {id: number, request: UserPersonalInformationRequest}) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<UserPersonalInformationResponse>>(`/users-personal-informations/id=${id}`, request);
        return response.data as HttpResponse<UserPersonalInformationResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePatchUserInformationMutation = () => {
    return useMutation<HttpResponse<UserPersonalInformationResponse> | ErrorResponse, Error, {id: number, request: UserPersonalInformationRequest}>({
        mutationFn: patchUserInformationFn,
        mutationKey: ["patchUserInformation"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};

async function patchAuthenticatedUserInformationFn(request: UserPersonalInformationRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.patch<HttpResponse<UserPersonalInformationResponse>>("/users-personal-informations/authenticated", request);
        return response.data as HttpResponse<UserPersonalInformationResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePatchAuthenticatedUserInformationMutation = () => {
    return useMutation<HttpResponse<UserPersonalInformationResponse> | ErrorResponse, Error, UserPersonalInformationRequest>({
        mutationFn: patchAuthenticatedUserInformationFn,
        mutationKey: ["patchAuthenticatedUserInformation"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
};