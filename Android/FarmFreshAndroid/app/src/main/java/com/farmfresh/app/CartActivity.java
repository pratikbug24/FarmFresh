package com.farmfresh.app;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

public class CartActivity extends AppCompatActivity {

    private CartManager cart;
    private CartAdapter adapter;
    private TextView tvEmpty, tvSubtotal, tvDelivery, tvTotal;
    private View summaryLayout;
    private MaterialButton btnCheckout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        cart = CartManager.get(this);

        tvEmpty = findViewById(R.id.tvEmptyCart);
        tvSubtotal = findViewById(R.id.tvSubtotal);
        tvDelivery = findViewById(R.id.tvDelivery);
        tvTotal = findViewById(R.id.tvTotal);
        summaryLayout = findViewById(R.id.summaryLayout);
        btnCheckout = findViewById(R.id.btnCheckout);
        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        RecyclerView rv = findViewById(R.id.rvCart);
        adapter = new CartAdapter(cart, this::updateSummary);
        rv.setLayoutManager(new LinearLayoutManager(this));
        rv.setAdapter(adapter);

        btnCheckout.setOnClickListener(v -> placeOrder());

        adapter.refresh();
        updateSummary();

        BottomNavHelper.setup(this, R.id.nav_cart);   // bottom menu bar
    }

    private void updateSummary() {
        boolean empty = cart.getTotalCount() == 0;
        tvEmpty.setVisibility(empty ? View.VISIBLE : View.GONE);
        summaryLayout.setVisibility(empty ? View.GONE : View.VISIBLE);

        tvSubtotal.setText("₹" + (int) cart.getSubtotal());
        double fee = cart.getDeliveryFee();
        tvDelivery.setText(fee == 0 ? "FREE" : "₹" + (int) fee);
        tvTotal.setText("₹" + (int) cart.getGrandTotal());

        BottomNavHelper.refreshBadge(this);           // cart count badge
    }

    private void placeOrder() {
        new AlertDialog.Builder(this)
                .setTitle("Confirm order")
                .setMessage("Place order for ₹" + (int) cart.getGrandTotal() + "?")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Place order", (d, w) -> {
                    cart.clear();
                    adapter.refresh();
                    updateSummary();
                    new AlertDialog.Builder(this)
                            .setTitle("Order placed 🎉")
                            .setMessage("Thank you! Your fresh fruits are on the way.")
                            .setCancelable(false)
                            .setPositiveButton("OK", (d2, w2) -> finish())
                            .show();
                })
                .show();
    }
}