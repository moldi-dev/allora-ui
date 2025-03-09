import React, {useEffect, useRef, useState} from 'react';
import {useGetAllOrdersQuery} from "@/apis/OrderAPI.ts";
import {OrderResponse} from "@/types/responses.ts";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import EmptyComponent from "@/components/empty-component.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {toast} from "react-hot-toast";
import DeleteOrderDialog from "@/components/admin-dashboard-page/delete-order-dialog.tsx";
import UpdateOrderDialog from "@/components/admin-dashboard-page/update-order-dialog.tsx";

function OrdersComponent() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const getAllOrdersQuery = useGetAllOrdersQuery(page);

    const [orderData, setOrderData] = useState<OrderResponse[]>([]);

    const selectedOrderRef = useRef<OrderResponse | null>(null);

    const [isDeleteOrderDialogOpen, setIsDeleteOrderDialogOpen] = useState<boolean>(false);
    const [isUpdateOrderDialogOpen, setIsUpdateOrderDialogOpen] = useState<boolean>(false);

    async function handleDeleteOrder(order: OrderResponse) {
        selectedOrderRef.current = order;
        setIsDeleteOrderDialogOpen(true);
    }

    async function handleUpdateOrder(order: OrderResponse) {
        selectedOrderRef.current = order;
        setIsUpdateOrderDialogOpen(true);
    }

    async function onDeleteOrderSuccess() {
        await getAllOrdersQuery.refetch();
        toast.success("The order has been deleted successfully!");
        setIsDeleteOrderDialogOpen(false);
    }

    async function onUpdateOrderSuccess() {
        await getAllOrdersQuery.refetch();
        toast.success("The order has been updated successfully!");
        setIsUpdateOrderDialogOpen(false);
    }

    useEffect(() => {
        if (getAllOrdersQuery.isSuccess && isHttpResponse(getAllOrdersQuery.data) && isPageResponse<OrderResponse[]>(getAllOrdersQuery.data.body)) {
            setTotalPages(getAllOrdersQuery.data.body.totalPages);
            setOrderData(getAllOrdersQuery.data.body.content);
        }
    }, [getAllOrdersQuery.data, getAllOrdersQuery.isSuccess]);

    if (getAllOrdersQuery.isPending) {
        return (
            <LoadingComponent/>
        )
    }

    else if (getAllOrdersQuery.isError) {
        return <ErrorComponent/>
    }

    else {
        if (orderData.length === 0) {
            return <EmptyComponent title="Allora" content="No orders could be found"/>
        }

        else {
            return (
                <>
                    {isUpdateOrderDialogOpen &&
                        <UpdateOrderDialog
                            order={selectedOrderRef.current}
                            open={isUpdateOrderDialogOpen}
                            onOpenChange={() => setIsUpdateOrderDialogOpen(false)}
                            onSuccess={onUpdateOrderSuccess} />
                    }

                    {isDeleteOrderDialogOpen &&
                        <DeleteOrderDialog
                            onSuccess={onDeleteOrderSuccess}
                            order={selectedOrderRef.current}
                            open={isDeleteOrderDialogOpen}
                            onOpenChange={() => setIsDeleteOrderDialogOpen(false)} />
                    }

                    <div className="container mx-auto p-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {orderData.map((order) => (
                                <Card className="w-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <CardTitle>Order #{order.orderId}</CardTitle>
                                            <Badge>{order.orderStatus}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">Ordered
                                            on {new Date(order.createdDate).toLocaleString()}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold mb-2">Items</h3>
                                                {order.orderLineProducts.map((item) => (
                                                    <div
                                                        className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                                                        <img
                                                            src={item.product.images[0].url}
                                                            alt={item.product.name}
                                                            width={50}
                                                            height={50}
                                                            className="rounded-md"
                                                        />
                                                        <div className="flex-grow">
                                                            <h4 className="font-semibold">{item.product.name}</h4>
                                                            <p className="text-sm text-gray-500">
                                                                {item.product.brand.name} - {item.product.category.name} ({item.product.gender.name})
                                                            </p>
                                                            <p className="text-sm">
                                                                Size: {item.productSize.name} |
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">${item.product.price.toFixed(2)}</p>
                                                            <p className="text-sm text-gray-500">
                                                                Total:
                                                                ${(item.product.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-2">Billing Information</h3>
                                                <p>{order.userPersonalInformation.firstName} {order.userPersonalInformation.lastName}</p>
                                                <p>{order.userPersonalInformation.address}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center">
                                        <p className="font-bold">Total: ${order.totalPrice.toFixed(2)}</p>
                                        <div className="space-x-2">
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(order)}>
                                                <Trash2 className="w-4 h-4 mr-2"/>
                                                Delete
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleUpdateOrder(order)}>
                                                <Pencil className="w-4 h-4 mr-2"/>
                                                Edit status
                                            </Button>
                                        </div>
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
                    </div>
                </>
            )
        }
    }
}

export default OrdersComponent;