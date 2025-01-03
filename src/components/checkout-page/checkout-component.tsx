import React from 'react';
import {UserResponse} from "@/types/responses.ts";
import Cart, {CartItem} from "@/lib/cart.ts";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {OrderLineProductRequest, OrderRequest} from "@/types/requests.ts";
import {usePlaceOrderMutation} from "@/apis/OrderAPI.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";

interface CheckoutComponentProps {
    user: UserResponse
}

function CheckoutComponent(props: CheckoutComponentProps) {
    const items = Cart.getAllItems();
    const total = Cart.getTotalPrice();

    const placeOrderMutation = usePlaceOrderMutation();

    function convertCartToOrderRequest(cartItems: CartItem[]): OrderRequest {
        let orderLineProducts: OrderLineProductRequest[] = [];

        cartItems.forEach((item) => {
            let orderLineProductRequest: OrderLineProductRequest = {
                productId: item.productId,
                quantity: item.quantity,
                productSizeId: item.productSizeId
            };

            orderLineProducts.push(orderLineProductRequest);
        });

        return {
            orderLineProducts: orderLineProducts
        };
    }

    async function handlePlaceOrder() {
        const orderLineProducts = convertCartToOrderRequest(items);

        const response = await placeOrderMutation.mutateAsync(orderLineProducts);

        if (isHttpResponse(response)) {
            window.location.href = response.responseMessage;
            Cart.clearCart();
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                    {items.map((item, index) => (
                        <Card key={index} className="mb-4">
                            <CardContent className="flex items-center p-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {item.productBrandName} | {item.productSizeName} | {item.productGenderName}
                                    </p>
                                    <p className="text-sm text-gray-600">{item.productCategoryName}</p>
                                    <p className="mt-1">
                                        Quantity: {item.quantity} x ${item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="text-xl font-semibold text-right mt-4">
                        Total: ${total.toFixed(2)}
                    </div>
                </div>
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <p>{props.user.userPersonalInformation.firstName}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <p>{props.user.userPersonalInformation.lastName}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <p>{props.user.userPersonalInformation.address}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <LoadingButton
                            className="w-full"
                            onClick={handlePlaceOrder}
                            clipLoaderColor="white"
                            isLoading={placeOrderMutation.isPending}
                            type="button">
                            Proceed to Payment
                        </LoadingButton>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default CheckoutComponent;