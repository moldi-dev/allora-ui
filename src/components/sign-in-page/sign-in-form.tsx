import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Link, useNavigate} from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import {createRef} from "react";
import LoadingButton from "@/components/ui/loading-button.tsx";
import PasswordInput from "@/components/ui/password-input.tsx";
import ReCAPTCHA from "react-google-recaptcha";
import { SignInRequest } from "@/types/requests.ts";
import { RECAPTCHA_SITE_KEY } from "@/constants.ts";
import {useSignInMutation} from "@/apis/AuthenticationAPI.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";

export default function SignInForm() {
    const navigate = useNavigate();

    const signInMutation = useSignInMutation();

    const recaptchaRef = createRef<ReCAPTCHA>();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<SignInRequest>();

    const onSubmit: SubmitHandler<SignInRequest> = async (data) => {
        const signInRequest: SignInRequest = {
            ...data,
            recaptchaToken: recaptchaRef.current.getValue()
        };

        recaptchaRef.current.reset();

        const response = await signInMutation.mutateAsync(signInRequest);

        if (isHttpResponse(response)) {
            navigate("/home");
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof SignInRequest, {
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
        <div className="flex min-h-screen flex-col lg:flex-row">
            <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center relative">

                <img
                    alt="Fashionable clothing display"
                    className="object-cover w-full h-full"
                    src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />

                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h1 className="text-white text-6xl font-bold tracking-wider">Allora</h1>
                </div>

            </div>
            <div className="flex flex-col justify-center items-center p-6 lg:w-1/2">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                            Sign in
                        </h2>
                        <p>
                            Enter your information below in order to sign in.
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
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link
                                    to="/forgot-password"
                                    className="font-medium text-primary underline hover:text-primary/90"
                                >
                                    Forgot your password?
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
                                isLoading={signInMutation.isPending}
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
