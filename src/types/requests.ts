export type UserPersonalInformationRequest = {
    firstName: string;
    lastName: string;
    address: string;
}

export type ProductRequest = {
    name: string;
    description: string;
    price: number;
    stock: number;
    sizesNames: string[];
    brandName: string;
    genderName: string;
    categoryName: string;
    images: File[]
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    DELIVERED = "DELIVERED"
}

export type OrderUpdateRequest = {
    orderStatus: OrderStatus;
}

export type OrderLineProductRequest = {
    productId: number;
    quantity: number;
    productSizeId: number;
}

export type OrderRequest = {
    orderLineProducts: OrderLineProductRequest[];
}

export type PasswordChangeRequest = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type PasswordResetRequest = {
    email: string;
    resetPasswordCode: string;
    newPassword: string;
    confirmNewPassword: string;
    recaptchaToken: string;
}

export type PasswordResetTokenRequest = {
    email: string;
    recaptchaToken: string;
}

export type ReviewRequest = {
    productId: number;
    rating: number;
    comment?: string;
}

export type SignInRequest = {
    username: string;
    password: string;
    recaptchaToken: string;
}

export type SignUpRequest = {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    password: string;
    confirmPassword: string;
    recaptchaToken: string;
}

export type ProductFilterRequest = {
    name: string;
    brandsIds: number[];
    categoriesIds: number[];
    sizesIds: number[];
    gendersIds: number[];
    minPrice?: number;
    maxPrice?: number;
    sort: string;
    page: number;
};

