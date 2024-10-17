import React from 'react';
import {ProductResponse} from "@/types/responses.ts";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {useDeleteProductMutation} from "@/apis/ProductsAPI.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";

type DeleteProductDialogProps = {
    product: ProductResponse;
    open: boolean;
    onOpenChange: () => void;
}

function DeleteProductDialog(props: DeleteProductDialogProps) {
    const deleteProductMutation = useDeleteProductMutation(props.product.productId);

    async function handleDeleteProduct() {
        const response = await deleteProductMutation.mutateAsync();

        if (isHttpResponse(response)) {
            window.location.reload();
        }

        else if (isErrorResponse(response)) {
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    }

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete a product</DialogTitle>
                    <DialogDescription>
                        Are you sure that you want to delete the product named <span className="text-red-500">{props.product.name}?</span>
                        This will remove all the associated orders with this product. This operation can not be undone!
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <LoadingButton
                        onClick={handleDeleteProduct}
                        className="w-full block mt-5"
                        type="button"
                        clipLoaderColor="white"
                        isLoading={deleteProductMutation.isPending}>
                        Delete the product
                    </LoadingButton>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteProductDialog;