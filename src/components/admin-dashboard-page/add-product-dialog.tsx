import React, {useState} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {ProductRequest} from "@/types/requests.ts";
import {isErrorResponse, isHttpResponse} from "@/lib/utils.ts";
import {toast} from "react-hot-toast";
import LoadingButton from "@/components/ui/loading-button.tsx";
import {usePostProductMutation} from "@/apis/ProductsAPI.ts";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel.tsx";
import ZoomableImage from "@/components/ui/zoomable-image.tsx";
import {Label} from "@/components/ui/label.tsx";
import {FileInput, FileUploader, FileUploaderContent, FileUploaderItem} from "@/components/ui/file-upload.tsx";
import {Paperclip} from "lucide-react";
import {dropZoneConfiguration} from "@/constants.ts";
import {FileSvgDraw} from "@/file-svg-draw.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {InputTags} from "@/components/ui/input-tags.tsx";

type AddProductDialogProps = {
    open: boolean;
    onOpenChange: () => void;
}

function AddProductDialog(props: AddProductDialogProps) {
    const [images, setImages] = useState<File[]>([]);
    const [sizesNames, setSizesNames] = useState<string[]>([]);

    const postProductMutation = usePostProductMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm<ProductRequest>();

    function createFormData(request: ProductRequest) {
        const formData = new FormData();

        formData.append("name", request.name);
        formData.append("description", request.description);
        formData.append("price", request.price.toString());
        formData.append("stock", request.stock.toString());
        formData.append("brandName", request.brandName);
        formData.append("genderName", request.genderName);
        formData.append("categoryName", request.categoryName);

        request.sizesNames.forEach((size) => {
            formData.append("sizesNames", size);
        });

        request.images.forEach((image) => {
            formData.append("images", image);
        });

        return formData;
    }

    const onSubmit: SubmitHandler<ProductRequest> = async (data) => {
        const productRequest: ProductRequest = {
            ...data,
            images: images,
            sizesNames: sizesNames
        };

        const formData = createFormData(productRequest);

        const response = await postProductMutation.mutateAsync(formData);

        if (isHttpResponse(response)) {
            window.location.reload();
        }

        else if (isErrorResponse(response) && response.validationErrors) {
            Object.entries(response.validationErrors).forEach(([field, message]) => {
                setError(field as keyof ProductRequest, {
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
    };

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="h-full w-full">
                <DialogHeader>
                    <DialogTitle>Add a new product</DialogTitle>
                    <DialogDescription>Fill in the information required below in order to create a new product.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="rounded-md flex-grow pr-5">
                    <form onSubmit={handleSubmit(onSubmit)} className="mr-5 ml-5">

                        <div className="space-y-4 flex justify-center">
                            {images && images.length > 0 &&
                                <Carousel opts={{align: "start", loop: false}} className="w-full max-w-xs">
                                    <CarouselContent className="items-center">
                                        {images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <ZoomableImage src={URL.createObjectURL(image)}/>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                </Carousel>
                            }
                        </div>

                        <div className="space-y-2 mt-3">
                            <Label>
                                Images
                                <span className="text-red-500">*</span>
                            </Label>
                            <FileUploader
                                id="files"
                                value={images}
                                onValueChange={(value) => setImages(value)}
                                dropzoneOptions={dropZoneConfiguration}
                                className="relative bg-background rounded-lg p-2"
                            >
                                <FileInput className="outline-dashed outline-1 outline-primary">
                                    <div
                                        className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                        <FileSvgDraw/>
                                    </div>
                                </FileInput>
                                <FileUploaderContent>
                                    {images && images.length > 0 && images.map((image, i) => (
                                        <FileUploaderItem key={i} index={i}>
                                            <Paperclip className="h-4 w-4 stroke-current text-primary"/>
                                            <span>{image.name}</span>
                                        </FileUploaderItem>
                                    ))}
                                </FileUploaderContent>
                            </FileUploader>
                            {errors.images && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.images.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <Label htmlFor="name">
                                    Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    type="text"
                                    className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="The product's name"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">
                                    Description
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    rows={5}
                                    placeholder="The product's description"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="brandName">
                                    Brand name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="brandName"
                                    {...register("brandName")}
                                    placeholder="The product's brand name"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.brandName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.brandName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="categoryName">
                                    Category name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="categoryName"
                                    {...register("categoryName")}
                                    placeholder="The product's category name"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.categoryName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.categoryName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="genderName">
                                    Gender name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="genderName"
                                    {...register("genderName")}
                                    placeholder="The product's gender name"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.genderName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.genderName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="price">
                                    Price
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="price"
                                    {...register("price")}
                                    type="number"
                                    step={0.01}
                                    placeholder="The product's price"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="stock">
                                    Stock
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="stock"
                                    {...register("stock")}
                                    type="number"
                                    placeholder="The product's stock"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                />
                                {errors.stock && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.stock.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sizesNames">
                                    Sizes names
                                    <span className="text-red-500">*</span>
                                </Label>
                                <InputTags
                                    value={sizesNames}
                                    onChange={(e) => setSizesNames(e)}
                                    id="sizesNames"
                                    placeholder="The product's sizes' names, comma separated"
                                    className="appearance-none px-4 py-3"
                                />
                                {errors.sizesNames && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.sizesNames.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        <LoadingButton
                            className="w-full block mt-5"
                            type="submit"
                            clipLoaderColor="white"
                            isLoading={postProductMutation.isPending}>
                            Add a new product
                        </LoadingButton>
                    </form>

                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default AddProductDialog;