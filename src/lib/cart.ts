export type CartItem = {
    productId: number;
    name: string;
    quantity: number;
    productSizeId: number;
    productSizeName: string;
    productGenderName: string;
    productCategoryName: string;
    productBrandName: string;
    price: number;
    image: string;
}

class Cart {
    private static STORAGE_KEY = 'shoppingCart';

    static getCart(): CartItem[] {
        const cartJson = localStorage.getItem(this.STORAGE_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    }

    private static saveCart(cart: CartItem[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    }

    static addItem(item: CartItem): void {
        const cart = this.getCart();

        const existingItem = cart.find(
            (cartItem) =>
                cartItem.productId === item.productId &&
                cartItem.productSizeId === item.productSizeId
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        }

        else {
            cart.push(item);
        }

        this.saveCart(cart);
    }

    static updateItem(productId: number, productSizeId: number, quantity: number): void {
        const cart = this.getCart();

        const item = cart.find(
            (cartItem) =>
                cartItem.productId === productId &&
                cartItem.productSizeId === productSizeId
        );

        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            }

            else {
                this.removeItem(productId, productSizeId);
                return;
            }
        }

        this.saveCart(cart);
    }

    static removeItem(productId: number, productSizeId: number): void {
        const cart = this.getCart().filter(
            (cartItem) =>
                !(cartItem.productId === productId && cartItem.productSizeId === productSizeId)
        );

        this.saveCart(cart);
    }

    static clearCart(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static getTotalItems(): number {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    static getItem(id: number) {
        const cart = this.getCart();

        return cart.find(
            (cartItem) => cartItem.productId === id
        );
    }

    static getAllItems(): CartItem[] {
        return this.getCart();
    }

    static getTotalPrice(): number {
        const cart = this.getCart();
        let total: number = 0;

        cart.map((item) => total += item.quantity * item.price);

        return total;
    }
}

export default Cart;
