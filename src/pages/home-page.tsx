import React from 'react';
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import UserNavigation from "@/components/user-navigation.tsx";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import HeroComponent from "@/components/home-page/hero-component.tsx";
import Footer from "@/components/ui/footer.tsx";
import {useGetProductsInStockQuery} from "@/apis/ProductsAPI.ts";
import FeaturedProductsComponent from "@/components/home-page/featured-products-component.tsx";
import {ProductResponse} from "@/types/responses.ts";

function HomePage() {
    const authenticatedUserDataQuery = useGetAuthenticatedUserDataQuery();
    const getFeaturedProducts = useGetProductsInStockQuery(0, 6);

    if (authenticatedUserDataQuery.isPending || getFeaturedProducts.isPending) {
        return (
            <LoadingPage />
        );
    }

    else if (authenticatedUserDataQuery.isError || getFeaturedProducts.isError) {
        return (
            <ErrorPage />
        );
    }

    else {
        const userData = isHttpResponse(authenticatedUserDataQuery.data) ? authenticatedUserDataQuery.data.body : null;
        const featuredProductsData = isHttpResponse(getFeaturedProducts.data) && isPageResponse(getFeaturedProducts.data.body) ? getFeaturedProducts.data.body.content as unknown as ProductResponse[] : [];

        return (
            <div className="flex flex-col min-h-screen">
                <div className="flex-1">
                    <UserNavigation user={userData}/>
                    <HeroComponent/>
                    {featuredProductsData.length > 0 &&
                        <FeaturedProductsComponent featuredProducts={featuredProductsData} />
                    }
                </div>
                <Footer/>
            </div>
        );
    }
}

export default HomePage;