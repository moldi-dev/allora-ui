import {OrderStatus} from "@/types/requests.ts";
import {ChatMessageType} from "@/enums/enums.ts";

export type HttpResponse<T> = {
    timestamp?: string;
    responseStatusCode?: number;
    responseStatus?: string;
    responseMessage?: string;
    responseDeveloperMessage?: string;
    body?: T;
}

export type ImageResponse = {
    imageId: number;
    name: string;
    size: number;
    type: string;
    url: string;
}

export type OrderLineProductResponse = {
    orderLineProductId: number;
    product: ProductResponse;
    quantity: number;
    productSize: ProductResponse;
}

export type OrderResponse = {
    orderId: number;
    orderLineProducts: OrderLineProductResponse[];
    totalPrice: number;
    orderStatus: OrderStatus;
    userPersonalInformation: UserPersonalInformationResponse;
    createdDate: string;
}

export type ProductBrandResponse = {
    productBrandId: number;
    name: string;
}

export type ProductCategoryResponse = {
    productCategoryId: number;
    name: string;
}

export type ProductGenderResponse = {
    productGenderId: number;
    name: string;
}

export type ProductSizeResponse = {
    productSizeId: number;
    name: string;
}

export type ProductResponse = {
    productId: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    sizes: ProductSizeResponse[];
    brand: ProductBrandResponse;
    gender: ProductGenderResponse;
    category: ProductCategoryResponse;
    images: ImageResponse[];
}

export type ReviewResponse = {
    reviewId: number;
    productId: number;
    comment?: string;
    rating: number;
    firstName: string;
    lastName: string;
    createdDate: string;
}

export type UserPersonalInformationResponse = {
    userPersonalInformationId: number;
    firstName: string;
    lastName: string;
    address: string;
}

export type AiPromptResponse = {
    response: string;
}

export type UserResponse = {
    userId: number;
    username: string;
    email: string;
    isAdministrator: boolean;
    userPersonalInformation: UserPersonalInformationResponse;
    lastLogin: string;
}

type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

type Sort = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
};

export type PageResponse<T> = {
    totalElements: number;
    totalPages: number;
    pageable: Pageable;
    first: boolean;
    last: boolean;
    size: number;
    content: T;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
};

export type PublicChatMessageResponse = {
    personalInformationId: number;
    firstName: string;
    lastName: string;
    messageType: ChatMessageType;
    content: string;
    createdDate: string;
}

type ValidationErrors = {
    [field: string]: string;
}

export type ErrorResponse = {
    timestamp?: string;
    errorCode?: number;
    errorStatus?: string;
    errorMessage?: string;
    requestPath?: string;
    validationErrors?: ValidationErrors;
}



