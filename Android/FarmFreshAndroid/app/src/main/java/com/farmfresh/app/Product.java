package com.farmfresh.app;

public class Product {
    public final int id;
    public final String name;
    public final String emoji;
    public final double price;   // price per unit in INR
    public final String unit;    // "kg", "dozen", "piece"

    public Product(int id, String name, String emoji, double price, String unit) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.price = price;
        this.unit = unit;
    }
}
