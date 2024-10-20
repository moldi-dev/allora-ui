import React, {createRef, useState} from 'react';
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Link} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {RECAPTCHA_SITE_KEY} from "@/constants.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {PasswordResetRequest, PasswordResetTokenRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {usePasswordResetMutation, usePasswordResetTokenMutation} from "@/apis/UserAPI.ts";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import PasswordInput from "@/components/ui/password-input.tsx";

function ForgotPasswordForm() {
    const [email, setEmail] = useState<string>("");

    const passwordResetTokenMutation = usePasswordResetTokenMutation();
    const passwordResetMutation = usePasswordResetMutation();

    const [isPasswordResetTokenSent, setIsPasswordResetTokenSent] = useState<boolean>(false);
    const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);

    const recaptchaRefTokenRequest = createRef<ReCAPTCHA>();
    const recaptchaRefResetPasswordRequest = createRef<ReCAPTCHA>();

    const passwordResetTokenRequestForm = useForm<PasswordResetTokenRequest>();
    const passwordResetRequestForm = useForm<PasswordResetRequest>();

    const onSubmitPasswordResetTokenRequest: SubmitHandler<PasswordResetTokenRequest> = async (data) => {
        const passwordResetTokenRequest: PasswordResetTokenRequest = {
            ...data,
            recaptchaToken: recaptchaRefTokenRequest.current.getValue()
        };

        recaptchaRefTokenRequest.current.reset();

        const response = await passwordResetTokenMutation.mutateAsync(passwordResetTokenRequest);

        if (isHttpResponse(response)) {
            toast.success("Follow the steps sent on your email in order to reset your password!");
            setIsPasswordResetTokenSent(true);
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                passwordResetTokenRequestForm.setError(field as keyof PasswordResetTokenRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                passwordResetTokenRequestForm.clearErrors();
            }, 3000);
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    };

    const onSubmitPasswordResetRequest: SubmitHandler<PasswordResetRequest> = async (data) => {
        const passwordResetRequest: PasswordResetRequest = {
            ...data,
            email: email,
            recaptchaToken: recaptchaRefResetPasswordRequest.current.getValue()
        };

        recaptchaRefResetPasswordRequest.current.reset();

        const response = await passwordResetMutation.mutateAsync(passwordResetRequest);

        if (isHttpResponse(response)) {
            setIsPasswordReset(true);
            toast.success("Your password has been successfully changed!");
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                passwordResetRequestForm.setError(field as keyof PasswordResetRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                passwordResetRequestForm.clearErrors();
            }, 3000);
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    }

    if (isPasswordResetTokenSent === false) {
        return (
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative">

                    <img
                        alt="Fashionable clothing"
                        className="object-cover w-full h-full"
                        src="src/assets/clothing-store-image.avif"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                    </div>

                </div>
                <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                    <div className="w-full max-w-md space-y-8">

                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Forgot password
                            </h2>
                            <p>
                                Enter your information below in order to reset your password.
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={passwordResetTokenRequestForm.handleSubmit(onSubmitPasswordResetTokenRequest)}>

                            <div className="space-y-4 rounded-md shadow-sm">
                                <div>
                                    <Label htmlFor="email">
                                        Email
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        {...passwordResetTokenRequestForm.register("email")}
                                        onChange={(event) => setEmail(event.target.value)}
                                        type="text"
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Email"
                                    />
                                    {passwordResetTokenRequestForm.formState.errors.email && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordResetTokenRequestForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <Link
                                        to="/sign-in"
                                        className="font-medium text-primary underline hover:text-primary/90"
                                    >
                                        Already registered? Sign in!
                                    </Link>
                                </div>
                                <div className="text-sm">
                                    <Link
                                        to="/sign-up"
                                        className="font-medium text-primary underline hover:text-primary/90"
                                    >
                                        Don’t have an account? Sign up!
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="recaptchaToken">
                                    Recaptcha
                                    <span className="text-red-500">*</span>
                                </Label>
                                <ReCAPTCHA
                                    ref={recaptchaRefTokenRequest}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                />
                                {passwordResetTokenRequestForm.formState.errors.recaptchaToken && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {passwordResetTokenRequestForm.formState.errors.recaptchaToken.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <LoadingButton
                                    isLoading={passwordResetTokenMutation.isPending}
                                    type="submit"
                                    clipLoaderColor="white"
                                    className="w-full block"
                                >
                                    Sign In
                                </LoadingButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }

    else if (isPasswordReset === false) {
        return (
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative">

                    <img
                        alt="Fashionable clothing"
                        className="object-cover w-full h-full"
                        src="src/assets/clothing-store-image.avif"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                    </div>

                </div>
                <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                    <div className="w-full max-w-md space-y-8">

                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Reset password
                            </h2>
                            <p>
                                Enter the information required below in order to reset your password.
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={passwordResetRequestForm.handleSubmit(onSubmitPasswordResetRequest)}>

                            <div className="space-y-4 rounded-md shadow-sm">
                                <div>
                                    <Label htmlFor="resetPasswordCode">
                                        Reset password code
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="resetPasswordCode"
                                        {...passwordResetRequestForm.register("resetPasswordCode")}
                                        rows={3}
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your password reset code"
                                    />
                                    {passwordResetRequestForm.formState.errors.email && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordResetRequestForm.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="newPassword">
                                        New password
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        register={passwordResetRequestForm.register("newPassword")}
                                        placeholder="Your new password"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    />
                                    {passwordResetRequestForm.formState.errors.newPassword && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordResetRequestForm.formState.errors.newPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="confirmNewPassword">
                                        Confirm your new password
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="confirmNewPassword"
                                        register={passwordResetRequestForm.register("confirmNewPassword")}
                                        placeholder="Your new password"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    />
                                    {passwordResetRequestForm.formState.errors.confirmNewPassword && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {passwordResetRequestForm.formState.errors.confirmNewPassword.message}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div>
                                <Label htmlFor="recaptchaToken">
                                    Recaptcha
                                    <span className="text-red-500">*</span>
                                </Label>
                                <ReCAPTCHA
                                    ref={recaptchaRefResetPasswordRequest}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                />
                                {passwordResetRequestForm.formState.errors.recaptchaToken && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {passwordResetRequestForm.formState.errors.recaptchaToken.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <LoadingButton
                                    isLoading={passwordResetMutation.isPending}
                                    type="submit"
                                    clipLoaderColor="white"
                                    className="w-full block"
                                >
                                    Reset your password
                                </LoadingButton>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );
    }

    else {
        return (
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative">

                    <img
                        alt="Fashionable clothing"
                        className="object-cover w-full h-full"
                        src="src/assets/clothing-store-image.avif"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                    </div>

                </div>
                <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                    <div className="w-full max-w-md space-y-8">

                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Password changed successfully
                            </h2>
                            <p>
                                Go back to the sign in page in order to authenticate.
                            </p>
                        </div>

                        <div>
                            <Link to="/sign-in">
                                <Button className="w-full block">
                                    Back to sign in
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgotPasswordForm;