import React, {useEffect, useState} from 'react';
import {OrderResponse} from "@/types/responses.ts";
import {useGetAuthenticatedUserOrdersQuery, usePayPendingOrderMutation} from "@/apis/OrderAPI.ts";
import {isErrorResponse, isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import EmptyComponent from "@/components/empty-component.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {OrderStatus} from "@/types/requests.ts";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {toast} from "react-hot-toast";
import LoadingButton from "@/components/ui/loading-button.tsx";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-green-500'
        case 'pending':
            return 'bg-yellow-500'
        case 'delivered':
            return 'bg-blue-500'
        default:
            return 'bg-gray-500'
    }
}

function UserOrdersComponent() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [orderData, setOrderData] = useState<OrderResponse[]>([]);

    const authenticatedUserOrdersQuery = useGetAuthenticatedUserOrdersQuery(page);

    const payPendingOrder = usePayPendingOrderMutation();

    useEffect(() => {
        if (authenticatedUserOrdersQuery.isSuccess && isHttpResponse(authenticatedUserOrdersQuery.data) && isPageResponse<OrderResponse[]>(authenticatedUserOrdersQuery.data.body)) {
            setTotalPages(authenticatedUserOrdersQuery.data.body.totalPages);
            setOrderData(authenticatedUserOrdersQuery.data.body.content);
        }
    }, [authenticatedUserOrdersQuery.isSuccess, authenticatedUserOrdersQuery.data]);

    async function handlePayPendingOrder(orderId: number) {
        const response = await payPendingOrder.mutateAsync(orderId);

        if (isHttpResponse(response)) {
            window.location.href = response.responseMessage;
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    }

    if (authenticatedUserOrdersQuery.isPending) {
        return <LoadingComponent />
    }

    else if (authenticatedUserOrdersQuery.isError) {
        return <ErrorComponent />
    }

    else {
        if (orderData.length === 0) {
            return <EmptyComponent title="Allora" content="It looks like you haven't placed any orders yet! Start exploring our latest collections and find styles that match your unique look."/>
        }

        else {
            return (
                <>
                    <div className="space-y-6">
                        {orderData.map((order) => (
                            <Card key={order.orderId} className="overflow-hidden">
                                <CardHeader className="bg-gray-100">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>Order #{order.orderId}</CardTitle>
                                        <Badge className={`${getStatusColor(order.orderStatus)} text-white`}>
                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">Ordered on: {new Date(order.orderDate).toLocaleString()}</p>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {order.orderLineProducts.map((item, index) => (
                                            <Card className="mb-4">
                                                <CardContent className="flex items-center p-4">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <img src={item.product.images[0].url}
                                                             alt={item.product.name}
                                                             width={80}
                                                             height={80}
                                                             className="rounded-md object-cover"/>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-lg">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-600">Size: {item.productSize.name} |
                                                            Quantity: {item.quantity}</p>
                                                        <p className="text-sm text-gray-600">Brand: {item.product.brand.name} |
                                                            Category: {item.product.category.name}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 text-right">
                                                        <p className="font-semibold">${item.product.price.toFixed(2)}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-100 flex justify-between items-center">
                                    <div className="text-lg font-semibold mt-3">
                                        Total: ${order.totalPrice.toFixed(2)}
                                    </div>
                                    {order.orderStatus === OrderStatus.PENDING && (
                                        <LoadingButton
                                            isLoading={payPendingOrder.isPending}
                                            clipLoaderColor="white"
                                            variant="default"
                                            className="mt-3"
                                            type="button"
                                            onClick={() => handlePayPendingOrder(order.orderId)}
                                        >
                                            Pay pending order
                                        </LoadingButton>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <Pagination className="mt-5 flex justify-center mb-5">
                        <PaginationContent>
                            {page > 0 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setPage((prevState) => prevState - 1)}/>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                            </PaginationItem>
                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => setPage((prevState) => prevState + 1)}/>
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                </>
            );
        }
    }
}

export default UserOrdersComponent;