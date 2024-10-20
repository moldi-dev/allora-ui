import React from 'react';
import {ProductResponse} from "@/types/responses.ts";
import ProductCard from "@/components/product-card.tsx";

type FeaturedProductsComponentProps = {
    featuredProducts: ProductResponse[];
}

function FeaturedProductsComponent(props: FeaturedProductsComponentProps) {
    return (
        <section className="py-12 px-4 md:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {props.featuredProducts.map((product) => (
                    <ProductCard key={product.productId} product={product}/>
                ))}
            </div>
        </section>
    );
}

export default FeaturedProductsComponent;