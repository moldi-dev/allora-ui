import React from 'react';
import {OrderResponse} from "@/types/responses.ts";
import {useUpdateOrderMutation} from "@/apis/OrderAPI.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {OrderUpdateRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";

type UpdateOrderDialogProps = {
    order: OrderResponse;
    open: boolean;
    onOpenChange: () => void;
    onSuccess: () => void;
}

function UpdateOrderDialog(props: UpdateOrderDialogProps) {

    const updateOrderMutation = useUpdateOrderMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<OrderUpdateRequest>();

    const onSubmit: SubmitHandler<OrderUpdateRequest> = async (data) => {
        const response = await updateOrderMutation.mutateAsync({
            id: props.order.orderId,
            request: data
        });

        if (isHttpResponse(response)) {
            props.onSuccess();
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof OrderUpdateRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                clearErrors();
            }, 3000);
        }

        else if (isErrorResponse(response)) {
            toast.error(response.errorMessage);
        }
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="h-max-md w-max-md">
                <DialogHeader>
                    <DialogTitle>Update an order</DialogTitle>
                    <DialogDescription>Change the information required below in order to update the order.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="mr-5 ml-5">

                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="name">
                                    Status
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    defaultValue={props.order.orderStatus.toString()}
                                    id="name"
                                    {...register("orderStatus")}
                                    type="text"
                                    className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="The order's status (PENDING, PAID or DELIVERED)"
                                />
                                {errors.orderStatus && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.orderStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <LoadingButton
                            className="w-full block mt-5"
                            type="submit"
                            clipLoaderColor="white"
                            isLoading={updateOrderMutation.isPending}>
                            Save changes
                        </LoadingButton>
                    </form>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateOrderDialog;