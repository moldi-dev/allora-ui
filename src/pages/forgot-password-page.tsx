import React from 'react';
import ForgotPasswordForm from "@/components/forgot-password-page/forgot-password-form.tsx";
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isHttpResponse} from "@/lib/utils.ts";
import {Navigate} from "react-router-dom";

function ForgotPasswordPage() {
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
            <ForgotPasswordForm/>
        );
    }
}

export default ForgotPasswordPage;