import React from 'react';
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {Navigate} from "react-router-dom";
import ProfileComponent from "@/components/profile-page/profile-component.tsx";
import UserNavigation from "@/components/user-navigation.tsx";
import Footer from "@/components/ui/footer.tsx";

function ProfilePage() {
    const authenticatedUserDataQuery = useGetAuthenticatedUserDataQuery();

    if (authenticatedUserDataQuery.isPending) {
        return (
            <LoadingPage/>
        );
    }

    else if (authenticatedUserDataQuery.isError) {
        return (
            <ErrorPage/>
        );
    }

    else if (isErrorResponse(authenticatedUserDataQuery.data)) {
        return (
            <Navigate to="/home" />
        );
    }

    else {
        const userData = isHttpResponse(authenticatedUserDataQuery.data) ? authenticatedUserDataQuery.data.body : null;

        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    <UserNavigation user={userData}/>
                    <ProfileComponent user={userData} />
                </div>
                <Footer/>
            </div>
        );
    }
}

export default ProfilePage;