import React from 'react';
import SignUpForm from "@/components/sign-up-page/sign-up-form.tsx";
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isHttpResponse} from "@/lib/utils.ts";
import {Navigate} from "react-router-dom";

function SignUpPage() {
    const authenticatedUserData = useGetAuthenticatedUserDataQuery();

    if (authenticatedUserData.isPending) {
        return (
            <LoadingPage/>
        );
    }

    else if (authenticatedUserData.isError) {
        return (
            <ErrorPage/>
        );
    }

    else if (isHttpResponse(authenticatedUserData.data)) {
        return (
            <Navigate to="/home" />
        );
    }

    return (
        <SignUpForm/>
    );
}

export default SignUpPage;