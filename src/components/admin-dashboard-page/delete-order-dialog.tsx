import React from 'react';
import {OrderResponse} from "@/types/responses.ts";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {useDeleteOrderMutation} from "@/apis/OrderAPI.ts";

type DeleteOrderDialogProps = {
    order: OrderResponse;
    open: boolean;
    onOpenChange: () => void;
    onSuccess: () => void;
}

function DeleteOrderDialog(props: DeleteOrderDialogProps) {
    const deleteOrderMutation = useDeleteOrderMutation(props.order.orderId);

    async function handleDeleteOrder() {
        const response = await deleteOrderMutation.mutateAsync();

        if (isHttpResponse(response)) {
            props.onSuccess();
        }

        else if (isErrorResponse(response)) {
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete an order</DialogTitle>
                    <DialogDescription>
                        Are you sure that you want to delete the order with id <span className="text-red-500">{props.order.orderId}</span>?
                        This operation can not be undone!
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <LoadingButton
                        onClick={handleDeleteOrder}
                        className="w-full block mt-5"
                        type="button"
                        clipLoaderColor="white"
                        isLoading={deleteOrderMutation.isPending}>
                        Delete the order
                    </LoadingButton>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteOrderDialog;