import React from 'react';
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isHttpResponse} from "@/lib/utils.ts";
import UserNavigation from "@/components/user-navigation.tsx";
import Footer from "@/components/ui/footer.tsx";
import {useParams} from "react-router-dom";
import ProductInformation from "@/components/single-product-page/product-information.tsx";

function SingleProductPage() {
    const authenticatedUserDataQuery = useGetAuthenticatedUserDataQuery();
    const {id} = useParams();

    if (authenticatedUserDataQuery.isPending) {
        return (
            <LoadingPage />
        );
    }

    else if (authenticatedUserDataQuery.isError) {
        return (
            <ErrorPage />
        );
    }

    else {
        const userData = isHttpResponse(authenticatedUserDataQuery.data) ? authenticatedUserDataQuery.data.body : null;

        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    <UserNavigation user={userData}/>
                    <ProductInformation productId={id}/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default SingleProductPage;