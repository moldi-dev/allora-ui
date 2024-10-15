import React from 'react';
import SignInForm from "@/components/sign-in-page/sign-in-form.tsx";
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isHttpResponse} from "@/lib/utils.ts";
import {Navigate} from "react-router-dom";

function SignInPage() {
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

    else {
        return (
            <SignInForm />
        );
    }
}

export default SignInPage;