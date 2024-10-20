import React from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import PasswordInput from "@/components/ui/password-input.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {PasswordChangeRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {usePatchAuthenticatedUserPasswordMutation} from "@/apis/UserAPI.ts";

function SecurityComponent() {

    const patchAuthenticatedUserPasswordMutation = usePatchAuthenticatedUserPasswordMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<PasswordChangeRequest>();

    const onSubmit: SubmitHandler<PasswordChangeRequest> = async (data) => {
        const request: PasswordChangeRequest = {
            ...data
        };

        const response = await patchAuthenticatedUserPasswordMutation.mutateAsync(request);

        if (isHttpResponse(response)) {
            toast.success("Your password has been changed successfully!");
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof PasswordChangeRequest, {
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
                <CardTitle>Change your password</CardTitle>
                <CardDescription>Update your password regularly to keep your account secure.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                            Current password
                            <span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="currentPassword"
                            placeholder="Your current password"
                            register={register("currentPassword")}
                        />
                        {errors.currentPassword && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">
                            New Password
                            <span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="newPassword"
                            placeholder="Your new password"
                            register={register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmNewPassword">
                            Confirm New Password
                            <span className="text-red-500">*</span>
                        </Label>
                        <PasswordInput
                            id="confirmNewPassword"
                            placeholder="Confirm your new password"
                            register={register("confirmNewPassword")}
                        />
                        {errors.confirmNewPassword && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.confirmNewPassword.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <LoadingButton
                        type="submit"
                        className="w-full"
                        clipLoaderColor="white"
                        isLoading={patchAuthenticatedUserPasswordMutation.isPending}>
                        Save Changes
                    </LoadingButton>
                </CardFooter>
            </form>
        </Card>
    );
}

export default SecurityComponent;