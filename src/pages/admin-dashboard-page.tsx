import React, {useEffect, useState} from 'react';
import {useGetAuthenticatedUserDataQuery} from "@/apis/UserAPI.ts";
import LoadingPage from "@/pages/loading-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import {isHttpResponse} from "@/lib/utils.ts";
import {Navigate, useSearchParams} from "react-router-dom";
import AdminNavigation from "@/components/admin-dashboard-page/admin-navigation.tsx";
import {ClipboardList, ShoppingBag, Star, Users} from "lucide-react";
import ProductsComponent from "@/components/admin-dashboard-page/products-component.tsx";
import EmptyComponent from "@/components/empty-component.tsx";
import UsersComponent from "@/components/admin-dashboard-page/users-component.tsx";
import ReviewsComponent from "@/components/admin-dashboard-page/reviews-component.tsx";

const components = [
    { name: "Users", icon: Users, param: "users" },
    { name: "Products", icon: ShoppingBag, param: "products" },
    { name: "Reviews", icon: Star, param: "reviews" },
    { name: "Orders", icon: ClipboardList, param: "orders" },
]

function AdminDashboardPage() {
    const getAuthenticatedUserData = useGetAuthenticatedUserDataQuery();

    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const component = searchParams.get("component");
        setActiveComponent(component || null);
    }, [searchParams]);

    if (getAuthenticatedUserData.isPending) {
        return (
            <LoadingPage />
        );
    }

    else if (getAuthenticatedUserData.isError) {
        return (
            <ErrorPage/>
        );
    }

    else if (isHttpResponse(getAuthenticatedUserData.data) && !getAuthenticatedUserData.data.body.isAdministrator) {
        return (
            <Navigate to="/home"/>
        );
    }

    else {
        const userData = isHttpResponse(getAuthenticatedUserData.data) ? getAuthenticatedUserData.data.body : null;

        return (
            <div className="min-h-screen flex flex-col lg:flex-row">
                <AdminNavigation user={userData} components={components}/>

                <div className="flex-grow flex items-center justify-center bg-gray-50">
                    {activeComponent === "products" && <ProductsComponent/>}
                    {activeComponent === "users" && <UsersComponent/>}
                    {activeComponent === "reviews" && <ReviewsComponent/>}
                    {activeComponent === null && (
                        <EmptyComponent
                            title="Allora Admin Dashboard"
                            content="Welcome to the admin dashboard!"
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default AdminDashboardPage;