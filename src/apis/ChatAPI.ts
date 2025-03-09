import { axiosInstance, GENERIC_ERROR_MESSAGE } from "@/constants";
import { PublicChatMessageRequest } from "@/types/requests";
import {ErrorResponse, PublicChatMessageResponse } from "@/types/responses";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function connectToPublicChatFn() {
    try {
        const response = await axiosInstance.post("/chat-messages/authenticated/connect-to-public-chat");
        return response.data as PublicChatMessageResponse;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useConnectToPublicChatMutation = () => {
    return useMutation<PublicChatMessageResponse | ErrorResponse, Error>({
        mutationFn: connectToPublicChatFn,
        mutationKey: ["connectToPublicChat"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
}

async function disconnectFromPublicChatFn() {
    try {
        const response = await axiosInstance.post("/chat-messages/authenticated/disconnect-from-public-chat");
        return response.data as PublicChatMessageResponse;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useDisconnectFromPublicChatMutation = () => {
    return useMutation<PublicChatMessageResponse | ErrorResponse, Error>({
        mutationFn: disconnectFromPublicChatFn,
        mutationKey: ["disconnectFromPublicChat"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
}

async function sendPublicChatMessageFn(request: PublicChatMessageRequest) {
    try {
        const response = await axiosInstance.post<PublicChatMessageResponse | ErrorResponse>("/chat-messages/authenticated/send-public-message", request);
        return response.data as PublicChatMessageResponse;
    }

    catch (error) {
        return error.response.data as ErrorResponse;
    }
}

export const useSendPublicChatMessageMutation = () => {
    return useMutation<PublicChatMessageResponse | ErrorResponse, Error, PublicChatMessageRequest>({
        mutationFn: sendPublicChatMessageFn,
        mutationKey: ["sendPublicChatMessage"],
        onSuccess(response) {
            return response;
        },
        onError(error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    });
}