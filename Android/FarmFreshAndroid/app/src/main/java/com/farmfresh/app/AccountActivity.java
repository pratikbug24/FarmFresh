package com.farmfresh.app;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

/** The "Account" tab: profile summary and shortcuts. */
public class AccountActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account);

        findViewById(R.id.rowOrders).setOnClickListener(v ->
                new AlertDialog.Builder(this)
                        .setTitle("My Orders")
                        .setMessage("You have no orders yet. Items you order will show up here.")
                        .setPositiveButton("OK", null)
                        .show());
        findViewById(R.id.rowCart).setOnClickListener(v ->
                startActivity(new Intent(this, CartActivity.class)));
        findViewById(R.id.rowAddress).setOnClickListener(v ->
                new AlertDialog.Builder(this)
                        .setTitle("Saved addresses")
                        .setMessage("Address book coming soon.")
                        .setPositiveButton("OK", null)
                        .show());
        findViewById(R.id.rowHelp).setOnClickListener(v ->
                new AlertDialog.Builder(this)
                        .setTitle("Help & Support")
                        .setMessage("Email us at hello@farmfresh.example\nWe reply within 24 hours.")
                        .setPositiveButton("OK", null)
                        .show());
        findViewById(R.id.btnSignOut).setOnClickListener(v ->
                new AlertDialog.Builder(this)
                        .setTitle("Sign out")
                        .setMessage("Sign out of FarmFresh?")
                        .setNegativeButton("Cancel", null)
                        .setPositiveButton("Sign out", (d, w) -> finish())
                        .show());

        BottomNavHelper.setup(this, R.id.nav_account);   // bottom menu bar
    }

    @Override
    protected void onResume() {
        super.onResume();
        BottomNavHelper.refreshBadge(this);              // cart count badge
    }
}
