package com.farmfresh.app;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

public class MainActivity extends AppCompatActivity {

    private CartManager cart;
    private ProductAdapter adapter;
    private MaterialButton btnViewCart;
    private TextView tvEmpty;
    private EditText etSearch;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        cart = CartManager.get(this);

        etSearch = findViewById(R.id.etSearch);
        tvEmpty = findViewById(R.id.tvEmpty);
        btnViewCart = findViewById(R.id.btnViewCart);
        RecyclerView rv = findViewById(R.id.rvProducts);

        adapter = new ProductAdapter(cart, this::updateCartBar);
        rv.setLayoutManager(new GridLayoutManager(this, 2));
        rv.setAdapter(adapter);
        adapter.setProducts(ProductRepository.getProducts());

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int a, int b, int c) { }
            @Override public void onTextChanged(CharSequence s, int a, int b, int c) {
                var results = ProductRepository.search(s.toString());
                adapter.setProducts(results);
                tvEmpty.setVisibility(results.isEmpty() ? TextView.VISIBLE : TextView.GONE);
            }
            @Override public void afterTextChanged(Editable s) { }
        });

        btnViewCart.setOnClickListener(v ->
                startActivity(new Intent(this, CartActivity.class)));

        BottomNavHelper.setup(this, R.id.nav_home);   // bottom menu bar
        updateCartBar();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Cart may have changed in CartActivity
        adapter.setProducts(ProductRepository.search(etSearch.getText().toString()));
        updateCartBar();
    }

    private void updateCartBar() {
        int count = cart.getTotalCount();
        if (count == 0) {
            btnViewCart.setText("Cart is empty");
            btnViewCart.setEnabled(false);
        } else {
            btnViewCart.setEnabled(true);
            btnViewCart.setText("View Cart  •  " + count + " item(s)  •  ₹"
                    + (int) cart.getSubtotal());
        }

        BottomNavHelper.refreshBadge(this);   // outside the if/else, so the badge clears at 0
    }
}