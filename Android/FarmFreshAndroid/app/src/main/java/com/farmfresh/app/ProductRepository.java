package com.farmfresh.app;

import java.util.ArrayList;
import java.util.List;

/**
 * Source of products.
 *
 * Right now this returns a local list so the app works offline.
 * To use your real PHP/MySQL backend, replace getProducts() with an HTTP call
 * (e.g. GET https://your-server/api/products.php) and parse the JSON into Product objects.
 * Match the fields to your `database` table / query.sql.
 */
public class ProductRepository {

    private static final List<Product> PRODUCTS = new ArrayList<>();

    static {
        PRODUCTS.add(new Product(1, "Apple", "🍎", 180, "kg"));
        PRODUCTS.add(new Product(2, "Banana", "🍌", 60, "dozen"));
        PRODUCTS.add(new Product(3, "Mango", "🥭", 220, "kg"));
        PRODUCTS.add(new Product(4, "Orange", "🍊", 90, "kg"));
        PRODUCTS.add(new Product(5, "Grapes", "🍇", 110, "kg"));
        PRODUCTS.add(new Product(6, "Strawberry", "🍓", 250, "kg"));
        PRODUCTS.add(new Product(7, "Pineapple", "🍍", 70, "piece"));
        PRODUCTS.add(new Product(8, "Watermelon", "🍉", 35, "kg"));
        PRODUCTS.add(new Product(9, "Pomegranate", "🍎", 200, "kg"));
        PRODUCTS.add(new Product(10, "Papaya", "🥭", 50, "kg"));
        PRODUCTS.add(new Product(11, "Kiwi", "🥝", 120, "box"));
        PRODUCTS.add(new Product(12, "Lemon", "🍋", 80, "kg"));
    }

    public static List<Product> getProducts() {
        return new ArrayList<>(PRODUCTS);
    }

    public static Product getById(int id) {
        for (Product p : PRODUCTS) {
            if (p.id == id) return p;
        }
        return null;
    }

    public static List<Product> search(String query) {
        List<Product> result = new ArrayList<>();
        String q = query == null ? "" : query.trim().toLowerCase();
        for (Product p : PRODUCTS) {
            if (q.isEmpty() || p.name.toLowerCase().contains(q)) result.add(p);
        }
        return result;
    }
}
