import React, {useEffect, useState} from 'react';
import {useGetProductByIdQuery} from "@/apis/ProductsAPI.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import {isErrorResponse, isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import {Minus, Plus, StarIcon} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {ProductResponse, ReviewResponse} from "@/types/responses.ts";
import ImageCarousel from "@/components/ui/image-carousel.tsx";
import {
    useGetAllReviewsByProductIdQuery,
    useGetCanAuthenticatedUserReviewProduct,
    usePostReviewMutation
} from "@/apis/ReviewAPI.ts";
import ReviewCard from "@/components/single-product-page/review-card.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import Cart, {CartItem} from "@/lib/cart.ts";
import {toast} from "react-hot-toast";
import EmptyComponent from "@/components/empty-component.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {ReviewRequest} from "@/types/requests.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";

type ProductInformationProps = {
    productId: string;
}

function ProductInformation(props: ProductInformationProps) {
    const [finalRating, setFinalRating] = useState<number>(0);

    const productDataQuery = useGetProductByIdQuery(parseInt(props.productId, 10));

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [reviews, setReviews] = useState<ReviewResponse[]>([]);

    const reviewDataQuery = useGetAllReviewsByProductIdQuery(parseInt(props.productId, 10), page);
    const canUserReviewProductQuery = useGetCanAuthenticatedUserReviewProduct(parseInt(props.productId, 10));

    const [canUserReview, setCanUserReview] = useState<boolean>(false);

    const postReviewMutation = usePostReviewMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<ReviewRequest>();

    const onSubmit: SubmitHandler<ReviewRequest> = async (data) => {
        const request: ReviewRequest = {
            ...data,
            productId: parseInt(props.productId, 10),
            rating: finalRating
        }

        const response = await postReviewMutation.mutateAsync(request);

        if (isHttpResponse(response)) {
            await reviewDataQuery.refetch();
            await canUserReviewProductQuery.refetch();
            toast.success("Your review has been successfully posted!");
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof ReviewRequest, {
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

    useEffect(() => {
        if (reviewDataQuery.isSuccess && isHttpResponse(reviewDataQuery.data) && isPageResponse(reviewDataQuery.data.body)) {
            setTotalPages(reviewDataQuery.data.body.totalPages);
            setReviews(reviewDataQuery.data.body.content as unknown as ReviewResponse[]);
        }
    }, [reviewDataQuery.data, reviewDataQuery.isSuccess]);

    useEffect(() => {
        if (canUserReviewProductQuery.isSuccess && isHttpResponse(canUserReviewProductQuery.data)) {
            setCanUserReview(canUserReviewProductQuery.data.body);
        }
    }, [canUserReviewProductQuery.data, canUserReviewProductQuery.isSuccess]);

    const handleAddToCart = (product: ProductResponse) => {
        const totalProductQuantity = Cart.getTotalQuantityForItem(product.productId);

        const sizeId: number = parseInt(selectedSize, 10);

        const item: CartItem = {
            name: product.name,
            price: product.price,
            productId: product.productId,
            quantity: selectedQuantity,
            productSizeId: sizeId,
            productSizeName: product.sizes.find(size => size.productSizeId === sizeId)?.name || "Unknown",
            image: product.images.at(0).url,
            productGenderName: product.gender.name,
            productCategoryName: product.category.name,
            productBrandName: product.brand.name
        };

        if (totalProductQuantity + item.quantity <= product.stock) {
            Cart.addItem(item);
        }

        else {
            toast.error("There aren't enough products in stock to add to your cart!");
        }
    }

    if (productDataQuery.isPending || reviewDataQuery.isPending || canUserReviewProductQuery.isPending) {
        return (
            <LoadingComponent />
        )
    }

    else if (productDataQuery.isError || reviewDataQuery.isError || canUserReviewProductQuery.isError) {
        return (
            <ErrorComponent/>
        )
    }

    else {
        const product = isHttpResponse<ProductResponse>(productDataQuery.data) ? productDataQuery.data.body : null;

        return (
            <>
                <Card className="w-full max-w-4xl mx-auto mb-10">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/2">
                                <ImageCarousel images={product.images} />
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold">{product.name}</h1>
                                    <p className="text-xl font-semibold mt-2">${product.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{product.description}</p>
                                </div>
                                <div>
                                    <p className="text-sm"><span className="font-semibold">Brand:</span> {product.brand.name}</p>
                                    <p className="text-sm"><span className="font-semibold">Gender:</span> {product.gender.name}</p>
                                    <p className="text-sm"><span className="font-semibold">Category:</span> {product.category.name}</p>
                                </div>
                                <div>
                                    <Label className="text-base">Size</Label>
                                    <RadioGroup className="flex gap-2 mt-2"
                                                onValueChange={setSelectedSize}
                                                value={selectedSize || undefined}>
                                        {product.sizes.map((size) => (
                                            <div key={size.productSizeId}>
                                                <RadioGroupItem
                                                    value={size.productSizeId.toString()}
                                                    id={size.productSizeId.toString()}
                                                    className="peer"/>
                                                <div className="flex flex-col items-center">
                                                    <Label htmlFor={size.productSizeId.toString()}
                                                           className="mt-1">{size.name}</Label>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-base">Quantity</Label>
                                    <div className="flex items-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                            disabled={selectedQuantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-12 text-center">{selectedQuantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}
                                            disabled={selectedQuantity >= product.stock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={!selectedSize}>
                                    Add to cart
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {reviews.length === 0 && (
                    <EmptyComponent title="Allora" content="This product hasn't received any reviews yet. Be the first to share your thoughts and help others make an informed decision! Your feedback could be invaluable to those considering a purchase."/>
                )}

                {reviews.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-10">
                            {reviews.map((review) => (
                                <ReviewCard key={review.reviewId} review={review}/>
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

                    </>
                )}

                {canUserReview && (
                    <Card className="w-full max-w-md mx-auto mt-10 mb-10">
                        <CardHeader>
                            <CardTitle>Review our product</CardTitle>
                            <CardDescription>
                                We’d love to hear your thoughts on our product! Your feedback helps us improve
                                and also guides other customers in making confident choices. Whether you’re thrilled
                                with your experience or have any suggestions, your voice matters to us.
                                Share your review today!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="rating" className="text-sm font-medium">
                                        Rating <span className="text-red-500">*</span> :
                                    </Label>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, index) => (
                                                <StarIcon
                                                    key={index}
                                                    onClick={() => setFinalRating(index + 1)}
                                                    className={`h-6 w-6 cursor-pointer ${
                                                        index < finalRating ? 'text-yellow-500' : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        {errors.rating && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.rating.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="comment" className="text-sm font-medium">
                                        Comment
                                    </Label>
                                    <Textarea
                                        id="comment"
                                        {...register("comment")}
                                        placeholder="Share your thoughts on our product"
                                        className="min-h-[100px]"
                                    />
                                    {errors.comment && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.comment.message}
                                        </p>
                                    )}
                                </div>
                                <LoadingButton
                                    type="submit"
                                    clipLoaderColor="white"
                                    isLoading={postReviewMutation.isPending}
                                    className="w-full"
                                >
                                    Submit review
                                </LoadingButton>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </>
        );
    }
}

export default ProductInformation;