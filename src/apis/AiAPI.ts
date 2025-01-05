import {AiPromptRequest} from "@/types/requests.ts";
import {awaitDeveloperTimeout, axiosInstance, GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {AiPromptResponse, HttpResponse} from "@/types/responses.ts";
import {ErrorResponse} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";

async function promptAiFn(request: AiPromptRequest) {
    await awaitDeveloperTimeout();

    try {
        const response = await axiosInstance.post<HttpResponse<AiPromptResponse>>("/ai", request);
        return response.data as HttpResponse<AiPromptResponse>;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const usePromptAiMutation = () => {
    return useMutation<HttpResponse<AiPromptResponse> | ErrorResponse, Error, AiPromptRequest>({
        mutationFn: promptAiFn,
        mutationKey: ["promptAi"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    })
}