package com.farmfresh.app;

public class CartItem {
    public final Product product;
    public int quantity;

    public CartItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public double getLineTotal() {
        return product.price * quantity;
    }
}
