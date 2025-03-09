import React, {useEffect, useRef, useState} from 'react';
import {useGetAllReviewsQuery} from "@/apis/ReviewAPI.ts";
import {ReviewResponse} from "@/types/responses.ts";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import EmptyComponent from "@/components/empty-component.tsx";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback} from "@/components/ui/avatar.tsx";
import {format} from "date-fns";
import {Star, Trash2} from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-hot-toast";
import DeleteReviewDialog from "@/components/admin-dashboard-page/delete-review-dialog.tsx";

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-5 h-5 ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                />
            ))}
        </div>
    )
}

function ReviewsComponent() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const getAllReviewsQuery = useGetAllReviewsQuery(page);

    const selectedReviewRef = useRef<ReviewResponse | null>(null);

    const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] = useState<boolean>(false);

    const [reviewData, setReviewData] = useState<ReviewResponse[]>([]);

    useEffect(() => {
        if (getAllReviewsQuery.isSuccess && isHttpResponse(getAllReviewsQuery.data) && isPageResponse(getAllReviewsQuery.data.body)) {
            setTotalPages(getAllReviewsQuery.data.body.totalPages);
            setReviewData(getAllReviewsQuery.data.body.content as unknown as ReviewResponse[]);
        }
    }, [getAllReviewsQuery.isSuccess, getAllReviewsQuery.data]);

    async function handleDeleteReview(review: ReviewResponse) {
        selectedReviewRef.current = review;
        setIsDeleteReviewDialogOpen(true);
    }

    async function onDeleteReviewSuccess() {
        await getAllReviewsQuery.refetch();
        toast.success("The review has been deleted successfully");
        setIsDeleteReviewDialogOpen(false);
    }

    if (getAllReviewsQuery.isPending) {
        return (
            <LoadingComponent />
        )
    }

    else if (getAllReviewsQuery.isError) {
        return (
            <ErrorComponent/>
        )
    }

    else {
        if (reviewData.length === 0) {
            return (
                <EmptyComponent title="Allora" content="No reviews could be found" />
            )
        }

        else {
            return (
                <>
                    {isDeleteReviewDialogOpen &&
                        <DeleteReviewDialog
                            onSuccess={onDeleteReviewSuccess}
                            review={selectedReviewRef.current}
                            open={isDeleteReviewDialogOpen}
                            onOpenChange={() => setIsDeleteReviewDialogOpen(false)} />
                    }

                    <div className="flex flex-col items-center space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-10 w-full px-4">
                            {reviewData.map(review => (
                                <Card key={review.reviewId} className="w-full max-w-md mx-auto">
                                    <CardHeader className="flex flex-col space-y-4">
                                        <StarRating rating={review.rating}/>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Avatar>
                                                    <AvatarFallback>{getInitials(review.firstName, review.lastName)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{`${review.firstName} ${review.lastName}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {review.comment && <p className="text-gray-600">{review.comment}</p>}
                                        <p className="text-sm text-gray-500">
                                            Posted on {format(review.createdDate, "MMMM d, yyyy")}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteReview(review)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        <Pagination className="mt-5 flex justify-center mb-10">
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
            );
        }
    }
}

export default ReviewsComponent;