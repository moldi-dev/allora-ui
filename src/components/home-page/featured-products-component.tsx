import React, {useState} from 'react';
import {ProductResponse} from "@/types/responses.ts";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Link} from "react-router-dom";

type FeaturedProductsComponentProps = {
    featuredProducts: ProductResponse[];
}

type FeaturedProductCardProps = {
    product: ProductResponse;
}

function FeaturedProductCard (props: FeaturedProductCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % props.product.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + props.product.images.length) % props.product.images.length)
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
                <div className="relative w-full h-full">
                    <img
                        src={props.product.images[currentImageIndex].url}
                        alt={props.product.name}
                        className="w-full h-full object-cover"
                    />
                    {props.product.images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                                onClick={prevImage}
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{props.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{props.product.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{props.product.brand.name}</Badge>
                        <Badge variant="outline">{props.product.category.name}</Badge>
                        <Badge>{props.product.gender.name}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                        {props.product.sizes.map((size) => (
                            <Badge key={size.productSizeId} variant="outline" className="text-xs">
                                {size.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-bold">${props.product.price.toFixed(2)}</span>
                <Link to={`/products/id=${props.product.productId}`}>
                    <Button>View product</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

function FeaturedProductsComponent(props: FeaturedProductsComponentProps) {
    return (
        <section className="py-12 px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {props.featuredProducts.map((product) => (
                    <FeaturedProductCard key={product.productId} product={product}/>
                ))}
            </div>
        </section>
    );
}

export default FeaturedProductsComponent;