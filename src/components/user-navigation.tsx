import React, { useState } from 'react';
import { UserResponse } from "@/types/responses.ts";
import {ShoppingCart, Shirt, User, AppWindowMac, ClipboardList} from "lucide-react";
import {Link} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useSignOutMutation} from "@/apis/AuthenticationAPI.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {Button} from "@/components/ui/button.tsx";

type UserNavigationProps = {
    user?: UserResponse;
}

function UserNavigation(props: UserNavigationProps) {
    const [isCartOpen, setCartOpen] = useState<boolean>(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false);

    const signOutMutation = useSignOutMutation();

    const toggleCart = () => {
        setCartOpen(!isCartOpen);
    };

    const toggleUserDetails = () => {
        setIsUserDetailsOpen(!isUserDetailsOpen);
    };

    async function handleSignOut() {
        const response = await signOutMutation.mutateAsync();

        if (isHttpResponse(response)) {
            window.location.reload();
        }

        else if (isErrorResponse(response)) {
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    }

    if (props.user === null) {
        return (
            <nav className="bg-white shadow-md mb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/home" className="flex-shrink-0 flex items-center">
                                <Shirt className="h-8 w-8" />
                                <span className="ml-2 text-2xl font-bold text-primary">Allora</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 hover:cursor-pointer"
                                              onClick={toggleCart}/>
                            </div>
                            <div className="relative">
                                <Link to="/sign-in">
                                    <Button>
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    else {
        return (
            <nav className="bg-white shadow-md mb-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/home" className="flex-shrink-0 flex items-center">
                                <Shirt className="h-8 w-8" />
                                <span className="ml-2 text-xl font-bold text-gray-900">Allora</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <User className="h-6 w-6 hover:cursor-pointer" onClick={toggleUserDetails} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4"/>
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ClipboardList className="mr-2 h-4 w-4"/>
                                            <span>Orders</span>
                                        </DropdownMenuItem>
                                        {props.user.isAdministrator &&
                                            <Link to="/admin-dashboard">
                                                <DropdownMenuItem>
                                                    <AppWindowMac className="mr-2 h-4 w-4"/>
                                                    <span>Admin Dashboard</span>
                                                </DropdownMenuItem>
                                            </Link>
                                        }
                                        <DropdownMenuSeparator/>
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            {props.user.username} <br/>
                                            {props.user.email}
                                        </div>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem>
                                            <LoadingButton
                                                className="block w-full"
                                                onClick={handleSignOut}
                                                clipLoaderColor="white"
                                                isLoading={signOutMutation.isPending}
                                                type="button"
                                            >
                                                Sign Out
                                            </LoadingButton>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="relative">
                                <ShoppingCart className="h-6 w-6 hover:cursor-pointer"
                                              onClick={toggleCart} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default UserNavigation;
