package com.farmfresh.app;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.VH> {

    private List<Product> products = new ArrayList<>();
    private final CartManager cart;
    private final Runnable onCartChanged;

    public ProductAdapter(CartManager cart, Runnable onCartChanged) {
        this.cart = cart;
        this.onCartChanged = onCartChanged;
    }

    public void setProducts(List<Product> list) {
        this.products = list;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_product, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int position) {
        Product p = products.get(position);
        h.emoji.setText(p.emoji);
        h.name.setText(p.name);
        h.price.setText("₹" + (int) p.price + " / " + p.unit);

        int qty = cart.getQuantity(p.id);
        if (qty == 0) {
            h.btnAdd.setVisibility(View.VISIBLE);
            h.qtyLayout.setVisibility(View.GONE);
        } else {
            h.btnAdd.setVisibility(View.GONE);
            h.qtyLayout.setVisibility(View.VISIBLE);
            h.qty.setText(String.valueOf(qty));
        }

        h.btnAdd.setOnClickListener(v -> {
            cart.add(p);
            notifyItemChanged(h.getBindingAdapterPosition());
            onCartChanged.run();
        });
        h.btnPlus.setOnClickListener(v -> {
            cart.add(p);
            notifyItemChanged(h.getBindingAdapterPosition());
            onCartChanged.run();
        });
        h.btnMinus.setOnClickListener(v -> {
            cart.decrease(p);
            notifyItemChanged(h.getBindingAdapterPosition());
            onCartChanged.run();
        });
    }

    @Override
    public int getItemCount() {
        return products.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView emoji, name, price, qty;
        MaterialButton btnAdd, btnPlus, btnMinus;
        View qtyLayout;

        VH(@NonNull View v) {
            super(v);
            emoji = v.findViewById(R.id.tvEmoji);
            name = v.findViewById(R.id.tvName);
            price = v.findViewById(R.id.tvPrice);
            qty = v.findViewById(R.id.tvQty);
            btnAdd = v.findViewById(R.id.btnAdd);
            btnPlus = v.findViewById(R.id.btnPlus);
            btnMinus = v.findViewById(R.id.btnMinus);
            qtyLayout = v.findViewById(R.id.qtyLayout);
        }
    }
}
