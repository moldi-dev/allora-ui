import React from 'react';
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import UserNavigation from "@/components/user-navigation.tsx";
import Footer from "@/components/ui/footer.tsx";
import UserOrdersComponent from "@/components/orders-page/user-orders-component.tsx";
import {Navigate} from "react-router-dom";

function OrdersPage() {
    const authenticatedUserDataQuery = useGetAuthenticatedUserDataQuery();

    if (authenticatedUserDataQuery.isPending) {
        return (
            <LoadingPage/>
        )
    }

    else if (authenticatedUserDataQuery.isError) {
        return (
            <ErrorPage/>
        )
    }

    else if (isErrorResponse(authenticatedUserDataQuery.data)) {
        return (
            <Navigate to="/home"/>
        )
    }

    else {
        const userData = authenticatedUserDataQuery.isSuccess && isHttpResponse(authenticatedUserDataQuery.data) ? authenticatedUserDataQuery.data.body : null;

        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    <UserNavigation user={userData}/>
                    <UserOrdersComponent />
                </div>
                <Footer/>
            </div>
        )
    }
}

export default OrdersPage;