package com.farmfresh.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Holds the cart and saves it to SharedPreferences (like localStorage in the web app). */
public class CartManager {

    public static final double DELIVERY_FEE = 40;
    public static final double FREE_DELIVERY_ABOVE = 500;

    private static CartManager instance;
    private final SharedPreferences prefs;
    private final Map<Integer, Integer> quantities = new LinkedHashMap<>();

    private CartManager(Context context) {
        prefs = context.getApplicationContext()
                .getSharedPreferences("farmfresh_cart", Context.MODE_PRIVATE);
        load();
    }

    public static synchronized CartManager get(Context context) {
        if (instance == null) instance = new CartManager(context);
        return instance;
    }

    public int getQuantity(int productId) {
        Integer q = quantities.get(productId);
        return q == null ? 0 : q;
    }

    public void add(Product p) {
        quantities.put(p.id, getQuantity(p.id) + 1);
        save();
    }

    public void decrease(Product p) {
        int q = getQuantity(p.id) - 1;
        if (q <= 0) quantities.remove(p.id);
        else quantities.put(p.id, q);
        save();
    }

    public void remove(Product p) {
        quantities.remove(p.id);
        save();
    }

    public void clear() {
        quantities.clear();
        save();
    }

    public int getTotalCount() {
        int total = 0;
        for (int q : quantities.values()) total += q;
        return total;
    }

    public List<CartItem> getItems() {
        List<CartItem> list = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : quantities.entrySet()) {
            Product p = ProductRepository.getById(e.getKey());
            if (p != null) list.add(new CartItem(p, e.getValue()));
        }
        return list;
    }

    public double getSubtotal() {
        double total = 0;
        for (CartItem item : getItems()) total += item.getLineTotal();
        return total;
    }

    public double getDeliveryFee() {
        double sub = getSubtotal();
        return (sub == 0 || sub >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_FEE;
    }

    public double getGrandTotal() {
        return getSubtotal() + getDeliveryFee();
    }

    private void save() {
        JSONObject obj = new JSONObject();
        try {
            for (Map.Entry<Integer, Integer> e : quantities.entrySet()) {
                obj.put(String.valueOf(e.getKey()), e.getValue());
            }
        } catch (JSONException ignored) { }
        prefs.edit().putString("items", obj.toString()).apply();
    }

    private void load() {
        quantities.clear();
        try {
            JSONObject obj = new JSONObject(prefs.getString("items", "{}"));
            Iterator<String> keys = obj.keys();
            while (keys.hasNext()) {
                String k = keys.next();
                quantities.put(Integer.parseInt(k), obj.getInt(k));
            }
        } catch (JSONException | NumberFormatException ignored) { }
    }
}
