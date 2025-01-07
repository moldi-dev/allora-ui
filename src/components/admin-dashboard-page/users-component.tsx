import React, {useEffect, useRef, useState} from 'react';
import {useGetAllUsersQuery} from "@/apis/UserAPI.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import {UserResponse} from "@/types/responses.ts";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import EmptyComponent from "@/components/empty-component.tsx";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {Pencil, Trash2} from "lucide-react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import DeleteUserDialog from "@/components/admin-dashboard-page/delete-user-dialog.tsx";
import {toast} from "react-hot-toast";
import UpdatePersonalDetailsDialog from "@/components/admin-dashboard-page/update-personal-details-dialog.tsx";

function UsersComponent() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const getAllUsersQuery = useGetAllUsersQuery(page);

    const [userData, setUserData] = useState<UserResponse[]>([]);

    const selectedUserRef = useRef<UserResponse | null>(null);

    const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState<boolean>(false);
    const [isUpdatePersonalDetailsDialogOpen, setIsUpdatePersonalDetailsdialogOpen] = useState<boolean>(false);

    function openDeleteUserDialog(user: UserResponse) {
        setIsDeleteUserDialogOpen(true);
        selectedUserRef.current = user;
    }

    function openUpdatePersonalDetailsDialog(user: UserResponse) {
        setIsUpdatePersonalDetailsdialogOpen(true);
        selectedUserRef.current = user;
    }

    async function onUpdatePersonalDetailsSuccess() {
        await getAllUsersQuery.refetch();
        toast.success("The user has been updated successfully!");
        setIsUpdatePersonalDetailsdialogOpen(false);
    }

    async function onDeleteUserSuccess() {
        await getAllUsersQuery.refetch();
        toast.success("The user has been deleted successfully!");
        setIsDeleteUserDialogOpen(false);
    }

    useEffect(() => {
        if (getAllUsersQuery.isSuccess && isHttpResponse(getAllUsersQuery.data) && isPageResponse(getAllUsersQuery.data.body)) {
            setTotalPages(getAllUsersQuery.data.body.totalPages);
            const data = getAllUsersQuery.data.body.content as unknown as UserResponse[];
            setUserData(data);
        }
    }, [getAllUsersQuery.data, getAllUsersQuery.isSuccess]);

    if (getAllUsersQuery.isPending) {
        return (
            <LoadingComponent />
        );
    }

    else if (getAllUsersQuery.isError) {
        return (
            <ErrorComponent/>
        )
    }

    else {
        if (userData.length === 0) {
            return (
                <EmptyComponent title="Allora" content="No users could be found" />
            );
        }

        else {
            return (
                <div className="container mx-auto p-4">

                    {isUpdatePersonalDetailsDialogOpen &&
                        <UpdatePersonalDetailsDialog user={selectedUserRef.current} open={isUpdatePersonalDetailsDialogOpen} onOpenChange={() => setIsUpdatePersonalDetailsdialogOpen(false)} onSuccess={onUpdatePersonalDetailsSuccess} />
                    }

                    {isDeleteUserDialogOpen &&
                        <DeleteUserDialog user={selectedUserRef.current} open={isDeleteUserDialogOpen} onOpenChange={() => setIsDeleteUserDialogOpen(false)} onSuccess={onDeleteUserSuccess} />
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userData.map((user) => (
                            <Card key={user.userId} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>{user.userPersonalInformation.firstName.at(0).concat(user.userPersonalInformation.lastName.at(0)).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle>{user.username}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p>{user.userPersonalInformation.firstName} {user.userPersonalInformation.lastName}</p>
                                            <p>{user.userPersonalInformation.address}</p>
                                        </div>
                                        <Badge
                                            variant={user.isAdministrator ? "destructive" : "outline"}>
                                            {user.isAdministrator ? "Administrator" : "Customer"}
                                        </Badge>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline"
                                            size="sm"
                                            onClick={() => openUpdatePersonalDetailsDialog(user)}>
                                        <Pencil className="mr-2 h-4 w-4"/> Update Personal Details
                                    </Button>
                                    <Button variant="destructive"
                                            size="sm"
                                            onClick={() => openDeleteUserDialog(user)}>
                                        <Trash2 className="mr-2 h-4 w-4"/> Delete
                                    </Button>
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
            );
        }
    }
}

export default UsersComponent;