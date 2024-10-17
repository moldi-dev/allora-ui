import React, {createRef, useState} from 'react';
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import PasswordInput from "@/components/ui/password-input.tsx";
import {Link} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {RECAPTCHA_SITE_KEY} from "@/constants.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {SignUpRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {useSignUpMutation} from "@/apis/AuthenticationAPI.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";

function SignUpForm() {
    const [signUpSucceeded, setSignUpSucceeded] = useState<boolean>(false);

    const signUpMutation = useSignUpMutation();

    const recaptchaRef = createRef<ReCAPTCHA>();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<SignUpRequest>();

    const onSubmit: SubmitHandler<SignUpRequest> = async (data) => {
        const signUpRequest: SignUpRequest = {
            ...data,
            recaptchaToken: recaptchaRef.current.getValue()
        };

        recaptchaRef.current.reset();

        const response = await signUpMutation.mutateAsync(signUpRequest);

        if (isHttpResponse(response)) {
           setSignUpSucceeded(true);
           toast.success("Successfully signed up!");
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof SignUpRequest, {
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

    if (signUpSucceeded === false) {
        return (
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative">

                    <img
                        alt="Fashionable clothing"
                        className="object-cover w-full h-full"
                        src="public/clothing-store-image.avif"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                    </div>

                </div>
                <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                    <div className="w-full max-w-md space-y-8">

                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Sign up
                            </h2>
                            <p>
                                Enter your information below in order to sign up.
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

                            <div className="space-y-4 rounded-md shadow-sm">
                                <div>
                                    <Label htmlFor="username">
                                        Username
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="username"
                                        {...register("username")}
                                        type="text"
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your username"
                                    />
                                    {errors.username && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.username.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">
                                        Email
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        {...register("email")}
                                        type="email"
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="firstName">
                                        First name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        {...register("firstName")}
                                        type="text"
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your first name"
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
                                        id="lastName"
                                        {...register("lastName")}
                                        type="text"
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your last name"
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
                                        id="address"
                                        {...register("address")}
                                        rows={3}
                                        className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                        placeholder="Your home address"
                                    />
                                    {errors.address && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.address.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">
                                        Password
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        register={register("password")}
                                        placeholder="Your password"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">
                                        Confirm your password
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        register={register("confirmPassword")}
                                        placeholder="Your password"
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.confirmPassword.message}
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
                            </div>

                            <div>
                                <Label htmlFor="recaptchaToken">
                                    Recaptcha
                                    <span className="text-red-500">*</span>
                                </Label>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                />
                                {errors.recaptchaToken && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.recaptchaToken.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <LoadingButton
                                    isLoading={signUpMutation.isPending}
                                    type="submit"
                                    clipLoaderColor="white"
                                    className="w-full block"
                                >
                                    Sign Up
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
                        src="public/clothing-store-image.avif"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                    </div>

                </div>
                <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                    <div className="w-full max-w-md space-y-8">

                        <div className="text-center">
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Sign up succeeded
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

export default SignUpForm;