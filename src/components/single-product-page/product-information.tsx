import React, {useEffect, useState} from 'react';
import {useGetProductByIdQuery} from "@/apis/ProductsAPI.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import { Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {ProductResponse, ReviewResponse} from "@/types/responses.ts";
import ImageCarousel from "@/components/ui/image-carousel.tsx";
import {useGetAllReviewsByProductIdQuery} from "@/apis/ReviewAPI.ts";
import ReviewCard from "@/components/single-product-page/review-card.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";

type ProductInformationProps = {
    productId: string;
}

function ProductInformation(props: ProductInformationProps) {
    const productDataQuery = useGetProductByIdQuery(parseInt(props.productId, 10));

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [reviews, setReviews] = useState<ReviewResponse[]>([]);

    const reviewDataQuery = useGetAllReviewsByProductIdQuery(parseInt(props.productId, 10), page);

    useEffect(() => {
        if (reviewDataQuery.isSuccess && isHttpResponse(reviewDataQuery.data) && isPageResponse(reviewDataQuery.data.body)) {
            setTotalPages(reviewDataQuery.data.body.totalPages);
            setReviews(reviewDataQuery.data.body.content as unknown as ReviewResponse[]);
        }
    }, [reviewDataQuery.data, reviewDataQuery.isSuccess]);

    const handleAddToCart = () => {
        console.log("SELECTED QUANTITY: " + selectedQuantity);
        console.log("SELECTED SIZE: " + selectedSize);
    }

    if (productDataQuery.isPending || reviewDataQuery.isPending) {
        return (
            <LoadingComponent />
        )
    }

    else if (productDataQuery.isError || reviewDataQuery.isError) {
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
                                                    value={size.name}
                                                    id={size.name}
                                                    className="peer"/>
                                                <div className="flex flex-col items-center">
                                                    <Label htmlFor={size.name}
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
                                <Button className="w-full" onClick={handleAddToCart} disabled={!selectedSize}>
                                    Add to Cart
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {reviews.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 mb-10">
                        {reviews.map((review) => (
                            <ReviewCard key={review.reviewId} review={review} />
                        ))}
                    </div>
                )}

                {reviews.length > 0 &&
                    <Pagination className="mt-5 flex justify-center mb-10">
                        <PaginationContent>
                            {page > 0 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setPage((prevState) => prevState - 1)} />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                            </PaginationItem>
                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => setPage((prevState) => prevState + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                }
            </>
        );
    }
}

export default ProductInformation;