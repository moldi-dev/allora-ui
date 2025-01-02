import React from 'react';
import {ReviewResponse} from "@/types/responses.ts";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {useDeleteReviewMutation} from "@/apis/ReviewAPI.ts";

type DeleteReviewDialogProps = {
    review: ReviewResponse;
    open: boolean;
    onOpenChange: () => void;
    onSuccess: () => void;
}

function DeleteReviewDialog(props: DeleteReviewDialogProps) {

    const deleteReviewMutation = useDeleteReviewMutation(props.review.reviewId);

    async function handleDeleteReview() {
        const response = await deleteReviewMutation.mutateAsync();

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
                    <DialogTitle>Delete a review</DialogTitle>
                    <DialogDescription>
                        Are you sure that you want to delete the review placed by <span className="text-red-500">{props.review.firstName} {props.review.lastName}</span>?
                        This operation can not be undone!
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <LoadingButton
                        onClick={handleDeleteReview}
                        className="w-full block mt-5"
                        type="button"
                        clipLoaderColor="white"
                        isLoading={deleteReviewMutation.isPending}>
                        Delete the review
                    </LoadingButton>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteReviewDialog;