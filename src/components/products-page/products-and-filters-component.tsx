import React, {Fragment, useEffect, useState} from 'react';
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import ProductCard from "@/components/product-card.tsx";
import {useGetAllProductSizesQuery} from "@/apis/ProductSizeAPI.ts";
import LoadingComponent from "@/components/ui/loading-component.tsx";
import ErrorComponent from "@/components/ui/error-component.tsx";
import {useGetAllProductGendersQuery} from "@/apis/ProductGenderAPI.ts";
import {useGetAllProductCategoriesInfiniteQuery} from "@/apis/ProductCategoryAPI.ts";
import {useGetAllProductBrandsInfiniteQuery} from "@/apis/ProductBrandAPI.ts";
import {ProductGenderResponse, ProductResponse, ProductSizeResponse} from "@/types/responses.ts";
import {isErrorResponse, isHttpResponse, isPageResponse} from "@/lib/utils.ts";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {ProductFilterRequest} from "@/types/requests.ts";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {useGetFilteredProductsMutation} from "@/apis/ProductsAPI.ts";
import EmptyComponent from "@/components/empty-component.tsx";

function ProductsAndFiltersComponent() {

    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [request, setRequest] = useState<ProductFilterRequest>({
        name: "",
        brandsIds: [],
        categoriesIds: [],
        sizesIds: [],
        gendersIds: [],
        minPrice: 1,
        maxPrice: 1000,
        sort: "name-ascending"
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<ProductFilterRequest>({
        defaultValues: request,
    });

    const getFilteredProducts = useGetFilteredProductsMutation();

    function onPageChange(newPage: number) {
        setPage(newPage);
        fetchProducts(newPage, request);
    }

    const fetchProducts = async (page: number, request: ProductFilterRequest) => {
        const response = await getFilteredProducts.mutateAsync({ page, request });

        if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof ProductFilterRequest, {
                    type: "server",
                    message,
                });
            });

            setTimeout(() => {
                clearErrors();
            }, 3000);
        } else if (isErrorResponse(response)) {
            setProductsData([]);
        }
    };

    const onSubmit: SubmitHandler<ProductFilterRequest> = async (data) => {
        setRequest(data);
        await fetchProducts(0, data);
    };

    const getAllProductSizes = useGetAllProductSizesQuery();
    const getAllProductGenders = useGetAllProductGendersQuery();
    const getAllProductCategories = useGetAllProductCategoriesInfiniteQuery();
    const getAllProductBrands = useGetAllProductBrandsInfiniteQuery();

    const [sizesData, setSizesData] = useState<ProductSizeResponse[]>([]);
    const [gendersData, setGendersData] = useState<ProductGenderResponse[]>([]);
    const [productsData, setProductsData] = useState<ProductResponse[]>([]);

    useEffect(() => {
        if (getAllProductSizes.isSuccess && isHttpResponse(getAllProductSizes.data)) {
            const data = getAllProductSizes.data.body as unknown as ProductSizeResponse[];
            setSizesData(data);
        }
    }, [getAllProductSizes.isSuccess, getAllProductSizes.data]);

    useEffect(() => {
        if (getAllProductGenders.isSuccess && isHttpResponse(getAllProductGenders.data)) {
            const data = getAllProductGenders.data.body as unknown as ProductGenderResponse[];
            setGendersData(data);
        }
    }, [getAllProductGenders.isSuccess, getAllProductGenders.data]);

    useEffect(() => {
        if (getFilteredProducts.isSuccess && isHttpResponse(getFilteredProducts.data) && isPageResponse(getFilteredProducts.data.body)) {
            const data = getFilteredProducts.data.body.content as unknown as ProductResponse[];
            setProductsData(data);
            setTotalPages(getFilteredProducts.data.body.totalPages);
        }
    }, [getFilteredProducts.isSuccess, getFilteredProducts.data]);

    if (getAllProductSizes.isPending || getAllProductGenders.isPending || getAllProductCategories.isPending || getAllProductBrands.isPending) {
        return (
            <LoadingComponent/>
        );
    }

    else if (getAllProductSizes.isError || getAllProductGenders.isError || getAllProductCategories.isError || getAllProductBrands.isError || getFilteredProducts.isError) {
        return (
            <ErrorComponent/>
        );
    }

    else {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-left">Our Products</h1>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                            {/* Search */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Search</h2>
                                <div className="flex">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="text" placeholder="Search products..." className="rounded-r-none" />
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Brands */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Brands</h2>
                                <div className="space-y-2">
                                    {getAllProductBrands.data?.pages.map((group, index) => (
                                        <Fragment key={index}>
                                            {isHttpResponse(group) && isPageResponse(group.body) &&
                                                group.body.content.map((brand) => (
                                                    <div key={brand.productBrandId} className="flex items-center">
                                                        <Controller
                                                            name="brandsIds"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    checked={field.value.includes(brand.productBrandId)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = checked
                                                                            ? [...field.value, brand.productBrandId]
                                                                            : field.value.filter((id) => id !== brand.productBrandId);
                                                                        field.onChange(newValue);
                                                                    }}
                                                                    id={`brand-${brand.productBrandId}`}
                                                                />
                                                            )}
                                                        />
                                                        <label htmlFor={`brand-${brand.productBrandId}`} className="ml-2 text-sm font-medium">
                                                            {brand.name}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Categories</h2>
                                <div className="space-y-2">
                                    {getAllProductCategories.data?.pages.map((group, index) => (
                                        <Fragment key={index}>
                                            {isHttpResponse(group) && isPageResponse(group.body) &&
                                                group.body.content.map((category) => (
                                                    <div key={category.productCategoryId} className="flex items-center">
                                                        <Controller
                                                            name="categoriesIds"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    checked={field.value.includes(category.productCategoryId)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = checked
                                                                            ? [...field.value, category.productCategoryId]
                                                                            : field.value.filter((id) => id !== category.productCategoryId);
                                                                        field.onChange(newValue);
                                                                    }}
                                                                    id={`category-${category.productCategoryId}`}
                                                                />
                                                            )}
                                                        />
                                                        <label htmlFor={`category-${category.productCategoryId}`} className="ml-2 text-sm font-medium">
                                                            {category.name}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Sizes</h2>
                                <div className="flex flex-wrap gap-2">
                                    {sizesData.map((size) => (
                                        <div key={size.productSizeId} className="flex items-center">
                                            <Controller
                                                name="sizesIds"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value.includes(size.productSizeId)}
                                                        onCheckedChange={(checked) => {
                                                            const newValue = checked
                                                                ? [...field.value, size.productSizeId]
                                                                : field.value.filter((id) => id !== size.productSizeId);
                                                            field.onChange(newValue);
                                                        }}
                                                        id={`size-${size.productSizeId}`}
                                                    />
                                                )}
                                            />
                                            <label htmlFor={`size-${size.productSizeId}`} className="ml-2 text-sm font-medium">
                                                {size.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Genders */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">For whom</h2>
                                <div className="space-y-2">
                                    {gendersData.map((gender) => (
                                        <div key={gender.productGenderId} className="flex items-center">
                                            <Controller
                                                name="gendersIds"
                                                control={control}
                                                render={({ field }) => (
                                                    <Checkbox
                                                        checked={field.value.includes(gender.productGenderId)}
                                                        onCheckedChange={(checked) => {
                                                            const newValue = checked
                                                                ? [...field.value, gender.productGenderId]
                                                                : field.value.filter((id) => id !== gender.productGenderId);
                                                            field.onChange(newValue);
                                                        }}
                                                        id={`gender-${gender.productGenderId}`}
                                                    />
                                                )}
                                            />
                                            <label htmlFor={`gender-${gender.productGenderId}`} className="ml-2 text-sm font-medium">
                                                {gender.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Price range</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="minPrice">Minimum</Label>
                                    <Controller
                                        name="minPrice"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" id="minPrice" />
                                        )}
                                    />
                                    {errors.minPrice && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.minPrice.message}
                                        </p>
                                    )}
                                    <Label htmlFor="maxPrice">Maximum</Label>
                                    <Controller
                                        name="maxPrice"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" id="maxPrice" />
                                        )}
                                    />
                                    {errors.maxPrice && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.maxPrice.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Sort</h2>
                                <Controller
                                    name="sort"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup {...field} value={field.value} onValueChange={field.onChange}>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="name-ascending" id="name-ascending" />
                                                    <Label htmlFor="name-ascending">A - Z</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="name-descending" id="name-descending" />
                                                    <Label htmlFor="name-descending">Z - A</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="price-ascending" id="price-ascending" />
                                                    <Label htmlFor="price-ascending">Price ascending</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="price-descending" id="price-descending" />
                                                    <Label htmlFor="price-descending">Price descending</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            {/* Filter Button */}
                            <LoadingButton
                                className="mt-4 w-full"
                                clipLoaderColor="white"
                                isLoading={getFilteredProducts.isPending}
                                type="submit"
                            >
                                Apply filters
                            </LoadingButton>
                        </form>
                    </aside>

                    {/* Main Content (products grid) */}
                    <div className="flex-1 flex flex-col items-center">
                        {productsData.length === 0 && (
                            <EmptyComponent
                                title="Allora"
                                content="No products could be found suiting your search.
                                Consider changing your filters! If you’re looking for specific items, try different search terms or clear some filters
                                to broaden your results. Additionally, you might want to check out our most popular categories or featured products
                                to see if anything catches your eye. We're here to help if you need assistance!"
                            />
                        )}

                        {productsData.length > 0 && (
                            <main className="flex-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {productsData.map((product) => (
                                        <ProductCard key={product.productId} product={product} />
                                    ))}
                                </div>
                            </main>
                        )}
                    </div>
                </div>

                {productsData.length > 0 && (
                    <Pagination className="mt-5 flex justify-center mb-5">
                        <PaginationContent>
                            {page > 0 && (
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => onPageChange(page - 1)} />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive={true}>{page + 1}</PaginationLink>
                            </PaginationItem>
                            {page < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationNext onClick={() => onPageChange(page + 1)} />
                                </PaginationItem>
                            )}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        );
    }
}

export default ProductsAndFiltersComponent;