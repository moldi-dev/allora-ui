import React from 'react';
import {UserResponse} from "@/types/responses.ts";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import {GENERIC_ERROR_MESSAGE} from "@/constants.ts";
import {useDeleteUserMutation} from "@/apis/UserAPI.ts";

type DeleteUserDialogProps = {
    user: UserResponse;
    open: boolean;
    onOpenChange: () => void;
    onSuccess: () => void;
}

function DeleteUserDialog(props: DeleteUserDialogProps) {
    const deleteUserMutation = useDeleteUserMutation(props.user.userId);

    async function handleDeleteUser() {
        const response = await deleteUserMutation.mutateAsync();

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
                    <DialogTitle>Delete a user</DialogTitle>
                    <DialogDescription>
                        Are you sure that you want to delete the user <span className="text-red-500">{props.user.username}</span>?
                        This will remove all the associated orders with this user. This operation can not be undone!
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <LoadingButton
                        onClick={handleDeleteUser}
                        className="w-full block mt-5"
                        type="button"
                        clipLoaderColor="white"
                        isLoading={deleteUserMutation.isPending}>
                        Delete the user
                    </LoadingButton>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteUserDialog;