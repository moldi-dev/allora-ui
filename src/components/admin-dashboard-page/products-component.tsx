import React, {useEffect, useRef, useState} from 'react';
import {useGetAllProductsQuery} from "@/apis/ProductsAPI.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import {isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import {ProductResponse} from "@/types/responses.ts";
import EmptyComponent from "@/components/empty-component.tsx";
import AddProductDialog from "@/components/admin-dashboard-page/add-product-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Plus, Trash2} from "lucide-react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import DeleteProductDialog from "@/components/admin-dashboard-page/delete-product-dialog.tsx";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import UpdateProductDialog from "@/components/admin-dashboard-page/update-product-dialog.tsx";
import {toast} from "react-hot-toast";

function ProductsComponent() {
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const selectedProductRef = useRef<ProductResponse | null>(null);

    const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState<boolean>(false);
    const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] = useState<boolean>(false);
    const [isUpdateProductDialogOpen, setIsUpdateProductDialogOpen] = useState<boolean>(false);

    const getAllProducts = useGetAllProductsQuery(page);

    const [productsData, setProductsData] = useState<ProductResponse[]>([]);

    useEffect(() => {
        if (getAllProducts.isSuccess && isHttpResponse(getAllProducts.data) && isPageResponse(getAllProducts.data.body)) {
            setTotalPages(getAllProducts.data.body.totalPages);

            const products = getAllProducts.data.body.content as unknown as ProductResponse[];

            setProductsData(products);
        }
    }, [getAllProducts.data, getAllProducts.isSuccess]);

    async function handleDeleteProduct(product: ProductResponse) {
        selectedProductRef.current = product;
        setIsDeleteProductDialogOpen(true);
    }

    async function handleUpdateProduct(product: ProductResponse) {
        selectedProductRef.current = product;
        setIsUpdateProductDialogOpen(true);
    }

    async function onAddProductSuccess() {
        await getAllProducts.refetch();
        toast.success("The product has been added successfully!");
        setIsAddProductDialogOpen(false);
    }

    async function onUpdateProductSuccess() {
        await getAllProducts.refetch();
        toast.success("The product has been updated successfully!");
        setIsUpdateProductDialogOpen(false);
    }

    async function onDeleteProductSuccess() {
        await getAllProducts.refetch();
        toast.success("The product has been deleted successfully!");
        setIsDeleteProductDialogOpen(false);
    }

    if (getAllProducts.isPending) {
        return (
            <LoadingComponent />
        );
    }

    else if (getAllProducts.isError) {
        return (
            <ErrorComponent />
        );
    }

    else {
        if (productsData.length === 0) {
            return (
                <>
                    <AddProductDialog onSuccess={onAddProductSuccess} open={isAddProductDialogOpen} onOpenChange={() => setIsAddProductDialogOpen(false)} />

                    <EmptyComponent title="Products"
                                    content="No products could be found. Consider adding the first product"
                                    buttonText="Add a new product"
                                    buttonAction={() => setIsAddProductDialogOpen(true)}
                    />
                </>
            );
        }

        else {
            return (
                <>
                    {isAddProductDialogOpen &&
                        <AddProductDialog onSuccess={onAddProductSuccess} open={isAddProductDialogOpen} onOpenChange={() => setIsAddProductDialogOpen(false)} />
                    }

                    {isDeleteProductDialogOpen &&
                        <DeleteProductDialog onSuccess={onDeleteProductSuccess} product={selectedProductRef.current} open={isDeleteProductDialogOpen} onOpenChange={() => setIsDeleteProductDialogOpen(false)} />
                    }

                    {isUpdateProductDialogOpen &&
                        <UpdateProductDialog onSuccess={onUpdateProductSuccess} product={selectedProductRef.current} open={isUpdateProductDialogOpen} onOpenChange={() => setIsUpdateProductDialogOpen(false)} />
                    }

                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-6">
                            <Button onClick={() => setIsAddProductDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4"/> Add a new product
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {productsData.map((product) => (
                                <Card key={product.productId} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle>{product.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex space-x-2 mb-4">
                                            {product.images.map((image) => (
                                                <img key={image.imageId}
                                                     src={image.url}
                                                     alt={`${image.name}`}
                                                     className="w-20 h-20 object-cover rounded"/>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">{product.brand.name}</span>
                                            <Badge variant="destructive">{product.category.name}</Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {product.sizes.map((size) => (
                                                <p key={size.productSizeId}>{size.name}</p>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Stock: {product.stock}</span>
                                            <span className="font-bold">${product.price.toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button variant="outline" size="sm" onClick={() => handleUpdateProduct(product)}>
                                            <Pencil className="mr-2 h-4 w-4"/> Update
                                        </Button>
                                        <Button variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteProduct(product)}>
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
                </>
            );
        }
    }
}

export default ProductsComponent;