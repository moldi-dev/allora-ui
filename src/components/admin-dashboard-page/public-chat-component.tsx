import React, {useEffect, useState} from 'react';
import EmptyComponent from "@/components/empty-component.tsx";
import {ChatMessageType} from "@/enums/enums.ts";
import {PublicChatMessageResponse, UserPersonalInformationResponse} from "@/types/responses.ts";
import {
    useConnectToPublicChatMutation,
    useDisconnectFromPublicChatMutation,
    useSendPublicChatMessageMutation
} from "@/apis/ChatAPI.ts";
import {isErrorResponse} from '@/lib/utils';
import toast from 'react-hot-toast';
import {Textarea} from "@/components/ui/textarea.tsx";
import {SendIcon} from 'lucide-react';
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {ADMIN_WEBSOCKET_URL} from '@/constants';
import {PublicChatMessageRequest} from '@/types/requests';
import {Avatar} from '../ui/avatar';
import {AvatarFallback} from "@/components/ui/avatar.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import LoadingButton from "@/components/ui/loading-button.tsx";

type PublicChatComponentProps = {
    userInformation: UserPersonalInformationResponse;
}

function PublicChatComponent(props: PublicChatComponentProps) {
    const [publicChatMessages, setPublicChatMessages] = useState<PublicChatMessageResponse[]>([]);
    const [socketError, setSocketError] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset
    } = useForm<PublicChatMessageRequest>();

    const joinPublicChat = useConnectToPublicChatMutation();
    const sendPublicChatMessage = useSendPublicChatMessageMutation();
    const leavePublicChat = useDisconnectFromPublicChatMutation();

    useEffect(() => {
        const socketFactory = () => new SockJS(`${ADMIN_WEBSOCKET_URL}`);
        const stompClient = Stomp.over(socketFactory);

        const onConnect = async () => {
            stompClient.subscribe('/chatroom/public', onMessage);
            await joinPublicChat.mutateAsync();
        };

        const onMessage = (message) => {
            const receivedMessage: PublicChatMessageResponse = JSON.parse(message.body);
            setPublicChatMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };

        const onError = () => {
            setSocketError(true);
        };

        const onDisconnect = () => {
            leavePublicChat.mutate();
        };

        stompClient.connect({}, onConnect, onError);

        return () => {
            stompClient.disconnect(onDisconnect);
        };
    }, []);

    const onSubmit: SubmitHandler<PublicChatMessageRequest> = async (data) => {
        const response = await sendPublicChatMessage.mutateAsync(data);

        reset();

        if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof PublicChatMessageRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                clearErrors();
            }, 3000);
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    }

    return (
        <div className="flex h-screen w-full flex-col bg-white">
            <div className="flex flex-1 overflow-x-auto">
                <div className="flex flex-1 flex-col">
                    <div className="flex-1 overflow-x-auto p-4">
                        <div className="grid gap-4">
                            {socketError === true && (
                                <EmptyComponent title="Allora" content="We're sorry but we couldn't connect you to the chat room. Please try again later or contact support if the issue persists!"/>
                            )}
                            {socketError === false && publicChatMessages.length > 0 && publicChatMessages.map((msg, index) => {
                                if (msg.messageType === ChatMessageType.CONNECT || msg.messageType === ChatMessageType.DISCONNECT) {
                                    return (
                                        <div key={index} className="flex items-center my-2 break-all text-black">
                                            <div className="flex-grow border-t border-black"></div>
                                            <span className="mx-2 whitespace-nowrap">{` ${msg.content} `}</span>
                                            <div className="flex-grow border-t border-black"></div>
                                        </div>
                                    );
                                } else if (msg.messageType === ChatMessageType.MESSAGE){
                                    return (
                                        <div
                                            key={index}
                                            className={`flex ${msg.personalInformationId === props.userInformation.userPersonalInformationId ? 'justify-end' : 'justify-start'} items-start`}
                                        >
                                            {msg.personalInformationId !== props.userInformation.userPersonalInformationId && (
                                                <Avatar className="h-12 w-12 border mt-3 mr-3">
                                                    <AvatarFallback>{msg.firstName.charAt(0).concat(msg.lastName.charAt(0))}</AvatarFallback>
                                                </Avatar>
                                            )}

                                            <div
                                                className={`grid gap-1 p-3 rounded-lg break-words ${msg.personalInformationId === props.userInformation.userPersonalInformationId ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                                            >
                                                {msg.personalInformationId !== props.userInformation.userPersonalInformationId && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium text-black">{msg.firstName.concat(' ').concat(msg.lastName)}</div>
                                                        <div className="text-xs text-gray-600">
                                                            {new Date(msg.createdDate).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                )}

                                                {msg.personalInformationId === props.userInformation.userPersonalInformationId && (
                                                    <div className="text-xs text-gray-300">
                                                        {new Date(msg.createdDate).toLocaleTimeString()}
                                                    </div>
                                                )}

                                                <div className="prose">
                                                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    {socketError === false && (
                        <div className="sticky bottom-0 bg-card px-4 py-3 shadow-sm md:px-6">
                            <div className="relative">
                                <form onSubmit={handleSubmit(onSubmit)} className="relative">
                                    <Textarea
                                        id="content"
                                        {...register("content")}
                                        placeholder="Type your message..."
                                        className="pr-20 min-h-[48px] rounded-2xl resize-none p-4 border border-primary shadow-sm focus:border-none"
                                        rows={3}
                                        maxLength={200}
                                        style={{ paddingRight: '80px' }}
                                    />
                                    <LoadingButton
                                        isLoading={sendPublicChatMessage.isPending}
                                        type="submit"
                                        size="icon"
                                        variant="ghost"
                                        clipLoaderColor="black"
                                        className="absolute w-8 h-8 top-1/2 transform -translate-y-1/2 right-3"
                                    >
                                        <SendIcon className="w-6 h-6 text-primary"/>
                                    </LoadingButton>
                                    {errors.content && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.content.message}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PublicChatComponent;