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

type CartListener = () => void;

class Cart {
    private static STORAGE_KEY = 'shoppingCart';
    private static listeners: CartListener[] = [];

    static getCart(): CartItem[] {
        const cartJson = localStorage.getItem(this.STORAGE_KEY);
        return cartJson ? JSON.parse(cartJson) : [];
    }

    private static saveCart(cart: CartItem[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.notifyListeners();
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

    static removeItem(productId: number, productSizeId: number): void {
        const cart = this.getCart().filter(
            (cartItem) =>
                !(cartItem.productId === productId && cartItem.productSizeId === productSizeId)
        );

        this.saveCart(cart);
    }

    static clearCart(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.notifyListeners();
    }

    static getTotalItems(): number {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    static getTotalQuantityForItem(productId: number) {
        const cart = this.getCart();
        return cart
            .filter(cartItem => cartItem.productId === productId)
            .reduce((total, cartItem) => total + cartItem.quantity, 0);
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

    static subscribe(listener: CartListener): void {
        this.listeners.push(listener);
    }

    static unsubscribe(listener: CartListener): void {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    private static notifyListeners(): void {
        this.listeners.forEach((listener) => listener());
    }
}

export default Cart;
