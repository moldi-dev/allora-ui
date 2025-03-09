import React, {useEffect, useState} from 'react';
import {UserResponse} from "@/types/responses.ts";
import {AppWindowMac, ClipboardList, LockIcon, Shirt, ShoppingCart, Trash2, User} from "lucide-react";
import {Link} from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useSignOutMutation} from "@/apis/AuthenticationAPI.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Separator} from "@/components/ui/separator"
import Cart from "@/lib/cart.ts";

type UserNavigationProps = {
    user?: UserResponse;
}

function UserNavigation(props: UserNavigationProps) {
    const [isCartOpen, setCartOpen] = useState<boolean>(false);
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false);

    const [totalItems, setTotalItems] = useState<number>(Cart.getTotalItems());

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

    function handleRemoveItem(productId: number, productSizeId: number) {
        Cart.removeItem(productId, productSizeId);
    }

    useEffect(() => {
        const updateTotalItems = () => setTotalItems(Cart.getTotalItems());

        Cart.subscribe(updateTotalItems);

        return () => Cart.unsubscribe(updateTotalItems);
    }, []);

    if (props.user === null) {
        return (
            <>
                <nav className="bg-white shadow-md mb-5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/home" className="flex-shrink-0 flex items-center">
                                    <Shirt className="h-8 w-8"/>
                                    <span className="ml-2 text-2xl font-bold text-primary">Allora</span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <ShoppingCart
                                        className="h-6 w-6 hover:cursor-pointer"
                                        onClick={toggleCart}
                                    />
                                    {totalItems > 0 &&
                                        <div
                                            className="absolute bottom-5 right-0 left-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                            {totalItems}
                                        </div>
                                    }
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

                {isCartOpen &&
                    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
                        <SheetContent className="w-full flex flex-col" aria-describedby={undefined}>
                            <SheetHeader>
                                <SheetTitle className="text-2xl font-bold">Shopping Cart</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow h-0 w-full">
                                {Cart.getAllItems().map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center mr-7 py-4">
                                            <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1 space-x-3">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-500">Price per item: ${item.price.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">Size: {item.productSizeName}</p>
                                                <p className="text-sm text-gray-500">Category: {item.productCategoryName}</p>
                                                <p className="text-sm text-gray-500">Gender: {item.productGenderName}</p>
                                                <p className="text-sm text-gray-500">Brand: {item.productBrandName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productId, item.productSizeId)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        {index < totalItems - 1 && <Separator />}
                                    </div>
                                ))}
                            </ScrollArea>
                            <div className="mt-auto p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-lg font-bold">${Cart.getTotalPrice().toFixed(2)}</span>
                                </div>
                                {totalItems > 0 &&
                                    <Link to="/sign-in">
                                        <Button className="w-full mt-4" size="lg">
                                            Sign in to order
                                        </Button>
                                    </Link>
                                }
                            </div>
                        </SheetContent>
                    </Sheet>
                }
            </>
        );
    } else {
        return (
            <>
                {isCartOpen &&
                    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
                        <SheetContent className="w-full flex flex-col" aria-describedby={undefined}>
                            <SheetHeader>
                                <SheetTitle className="text-2xl font-bold">Shopping Cart</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow h-0 w-full">
                                {Cart.getAllItems().map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center mr-7 py-4">
                                            <div className="relative h-20 w-20 overflow-hidden rounded-md">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1 space-x-3">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-500">Price per item: ${item.price.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">Size: {item.productSizeName}</p>
                                                <p className="text-sm text-gray-500">Category: {item.productCategoryName}</p>
                                                <p className="text-sm text-gray-500">Gender: {item.productGenderName}</p>
                                                <p className="text-sm text-gray-500">Brand: {item.productBrandName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                                <button
                                                    onClick={() => handleRemoveItem(item.productId, item.productSizeId)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                        {index < totalItems - 1 && <Separator />}
                                    </div>
                                ))}
                            </ScrollArea>
                            <div className="mt-auto p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-lg font-bold">${Cart.getTotalPrice().toFixed(2)}</span>
                                </div>
                                {totalItems > 0 &&
                                    <Link to="/checkout">
                                        <Button className="w-full mt-4" size="lg">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                }
                            </div>
                        </SheetContent>
                    </Sheet>
                }

                <nav className="bg-white shadow-md mb-5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/home" className="flex-shrink-0 flex items-center">
                                    <Shirt className="h-8 w-8"/>
                                    <span className="ml-2 text-xl font-bold text-gray-900">Allora</span>
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Avatar>
                                                <AvatarFallback className="h-10 w-10 hover:cursor-pointer"
                                                                onClick={toggleUserDetails}>
                                                    {props.user.userPersonalInformation.firstName.at(0).concat(props.user.userPersonalInformation.lastName.at(0)).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <Link to="/profile">
                                                <DropdownMenuItem>
                                                    <User className="mr-2 h-4 w-4"/>
                                                    <span>Profile</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/orders">
                                                <DropdownMenuItem>
                                                    <ClipboardList className="mr-2 h-4 w-4"/>
                                                    <span>Orders</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link to="/security">
                                                <DropdownMenuItem>
                                                    <LockIcon className="mr-2 h-4 w-4"/>
                                                    <span>Security</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            {props.user.isAdministrator &&
                                                <Link to="/admin-dashboard">
                                                    <DropdownMenuItem>
                                                        <AppWindowMac className="mr-2 h-4 w-4"/>
                                                        <span>Admin Dashboard</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                            }
                                            <DropdownMenuSeparator/>
                                            <div className="pl-2 py-2 text-sm text-gray-500">
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
                                    <ShoppingCart
                                        className="h-6 w-6 hover:cursor-pointer"
                                        onClick={toggleCart}
                                    />
                                    {totalItems > 0 &&
                                        <div
                                            className="absolute bottom-5 right-0 left-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                                            {totalItems}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default UserNavigation;
