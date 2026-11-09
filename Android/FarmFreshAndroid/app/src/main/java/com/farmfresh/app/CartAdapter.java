package com.farmfresh.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

public class CartAdapter extends RecyclerView.Adapter<CartAdapter.VH> {

    private List<CartItem> items = new ArrayList<>();
    private final CartManager cart;
    private final Runnable onChanged;

    public CartAdapter(CartManager cart, Runnable onChanged) {
        this.cart = cart;
        this.onChanged = onChanged;
    }

    public void refresh() {
        items = cart.getItems();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new VH(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_cart, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int position) {
        CartItem item = items.get(position);
        Product p = item.product;
        h.emoji.setText(p.emoji);
        h.name.setText(p.name);
        h.price.setText("₹" + (int) p.price + " / " + p.unit);
        h.qty.setText(String.valueOf(item.quantity));
        h.total.setText("₹" + (int) item.getLineTotal());

        h.btnPlus.setOnClickListener(v -> { cart.add(p); refresh(); onChanged.run(); });
        h.btnMinus.setOnClickListener(v -> { cart.decrease(p); refresh(); onChanged.run(); });
        h.btnRemove.setOnClickListener(v -> { cart.remove(p); refresh(); onChanged.run(); });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView emoji, name, price, qty, total;
        MaterialButton btnPlus, btnMinus;
        ImageButton btnRemove;

        VH(@NonNull View v) {
            super(v);
            emoji = v.findViewById(R.id.tvEmoji);
            name = v.findViewById(R.id.tvName);
            price = v.findViewById(R.id.tvPrice);
            qty = v.findViewById(R.id.tvQty);
            total = v.findViewById(R.id.tvLineTotal);
            btnPlus = v.findViewById(R.id.btnPlus);
            btnMinus = v.findViewById(R.id.btnMinus);
            btnRemove = v.findViewById(R.id.btnRemove);
        }
    }
}
