import React from 'react';
import {UserResponse} from "@/types/responses.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {UserPersonalInformationRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {usePatchAuthenticatedUserInformationMutation} from "@/apis/UserPersonalInformationAPI.ts";

type ProfileComponentProps = {
    user: UserResponse
}

function ProfileComponent(props: ProfileComponentProps) {
    const patchAuthenticatedUserInformationMutation = usePatchAuthenticatedUserInformationMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<UserPersonalInformationRequest>();

    const onSubmit: SubmitHandler<UserPersonalInformationRequest> = async (data) => {
        const request: UserPersonalInformationRequest = {
            firstName: props.user.userPersonalInformation.firstName,
            lastName: props.user.userPersonalInformation.lastName,
            address: data.address,
        };

        const response = await patchAuthenticatedUserInformationMutation.mutateAsync(request);

        if (isHttpResponse(response)) {
            toast.success("Your personal information has been updated successfully!");
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
        <Card className="w-full max-w-2xl mx-auto mb-5">
            <CardHeader>
                <CardTitle>Update your personal information</CardTitle>
                <CardDescription>Keep your information up to date.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                First Name
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Your first name"
                                defaultValue={props.user.userPersonalInformation.firstName}
                                disabled
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Last Name
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Your last name"
                                defaultValue={props.user.userPersonalInformation.lastName}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">
                            Address
                            <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            rows={5}
                            id="address"
                            name="address"
                            placeholder="Your address"
                            {...register("address")}
                            defaultValue={props.user.userPersonalInformation.address}
                        />
                        {errors.address && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.address.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <LoadingButton
                        type="submit"
                        className="w-full"
                        clipLoaderColor="white"
                        isLoading={patchAuthenticatedUserInformationMutation.isPending}>
                        Save Changes
                    </LoadingButton>
                </CardFooter>
            </form>
        </Card>
    );
}

export default ProfileComponent;