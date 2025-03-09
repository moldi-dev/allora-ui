import {AiPromptRequest} from '@/types/requests';
import React, {useEffect, useRef, useState} from 'react';
import {AiPromptResponse} from "@/types/responses.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {usePromptAiMutation} from "@/apis/AiAPI.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {Send} from "lucide-react";

const startingMessages: ChatMessage[] = [
    { response: "Hello! I'm an AI assistant trained to generate and execute SQL on the database. " +
            "Please tell me what I should do! (e.g., ask me to get the prices for each product)" }
]

type ChatMessage = AiPromptRequest | AiPromptResponse;

const ChatMessage: React.FC<{ message: ChatMessage; isUser: boolean }> = ({ message, isUser }) => {
    const isRequest = 'prompt' in message;
    const content = isRequest ? message.prompt : message.response;

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isUser ? 'bg-black text-white' : 'bg-white text-gray-700'
                }`}
            >
                {content}
            </div>
        </div>
    );
};

function AiAssistantComponent() {
    const [messages, setMessages] = useState<ChatMessage[]>(startingMessages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const promptAiMutation = usePromptAiMutation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset
    } = useForm<AiPromptRequest>();

    const onSubmit: SubmitHandler<AiPromptRequest> = async (data) => {
        const apiResponse = await promptAiMutation.mutateAsync(data);

        if (isHttpResponse<AiPromptResponse>(apiResponse)) {
            const newResponseMessage: AiPromptResponse = {
                response: apiResponse.body.response,
            };

            const newRequestMessage: AiPromptRequest = {
                prompt: data.prompt,
            };

            setMessages((prevMessages) => [...prevMessages, newRequestMessage]);
            setMessages((prevMessages) => [...prevMessages, newResponseMessage]);

            reset();
        }

        else if (isErrorResponse(apiResponse) && apiResponse.validationErrors) {
            Object.entries(apiResponse.validationErrors).forEach(([field, message]) => {
                setError(field as keyof AiPromptRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                clearErrors();
            }, 3000);
        }

        else if (isErrorResponse(apiResponse)) {
            toast.error(apiResponse.errorMessage);
        }
    }

    return (
        <div className="flex flex-col h-screen w-full bg-gray-100">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                {messages.map((message, index) => (
                    <ChatMessage
                        key={index}
                        message={message}
                        isUser={'prompt' in message}
                    />
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-4">
                  <Textarea
                      {...register("prompt")}
                      placeholder="Type your prompt here..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg"
                      rows={3}
                  />
                    <LoadingButton
                        clipLoaderColor="white"
                        isLoading={promptAiMutation.isPending}
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded-lg"
                    >
                        <Send className="w-4 h-4 mr-2"/>
                    </LoadingButton>
                </div>
                {errors.prompt && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.prompt.message}
                    </p>
                )}
            </form>
        </div>
    )
}

export default AiAssistantComponent;