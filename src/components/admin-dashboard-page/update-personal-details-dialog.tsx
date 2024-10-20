import React from 'react';
import {UserResponse} from "@/types/responses.ts";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {UserPersonalInformationRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {usePatchUserInformationMutation} from "@/apis/UserPersonalInformationAPI.ts";
import {Textarea} from "@/components/ui/textarea.tsx";

type UpdatePersonalDetailsDialogProps = {
    user: UserResponse;
    open: boolean;
    onOpenChange: () => void;
    onSuccess: () => void;
}

function UpdatePersonalDetailsDialog(props: UpdatePersonalDetailsDialogProps) {
    const patchUserInformationMutation = usePatchUserInformationMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<UserPersonalInformationRequest>();

    const onSubmit: SubmitHandler<UserPersonalInformationRequest> = async (data) => {
        const request: UserPersonalInformationRequest = {
            ...data,
        };

        const response = await patchUserInformationMutation.mutateAsync({
            id: props.user.userPersonalInformation.userPersonalInformationId,
            request: request
        });

        if (isHttpResponse(response)) {
            props.onSuccess();
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof UserPersonalInformationRequest, {
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
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="h-full w-full">
                <DialogHeader>
                    <DialogTitle>Update a user</DialogTitle>
                    <DialogDescription>Change the information required below in order to update the user.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="mr-5 ml-5">

                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="firstName">
                                    First Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    defaultValue={props.user.userPersonalInformation.firstName}
                                    id="firstName"
                                    {...register("firstName")}
                                    type="text"
                                    className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="The user's first name"
                                />
                                {errors.firstName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="lastName">
                                    Last name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    defaultValue={props.user.userPersonalInformation.lastName}
                                    id="lastName"
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="The user's last name"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.lastName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="address">
                                    Address
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    defaultValue={props.user.userPersonalInformation.address}
                                    id="address"
                                    rows={5}
                                    {...register("address")}
                                    placeholder="The user's address"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.address && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        <LoadingButton
                            className="w-full block mt-5"
                            type="submit"
                            clipLoaderColor="white"
                            isLoading={patchUserInformationMutation.isPending}>
                            Save changes
                        </LoadingButton>
                    </form>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default UpdatePersonalDetailsDialog;