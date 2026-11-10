package com.farmfresh.app;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import com.google.android.material.badge.BadgeDrawable;
import com.google.android.material.bottomnavigation.BottomNavigationView;

/** Shared bottom navigation bar for Home and Cart screens. */
public class BottomNavHelper {

    /** Call once in onCreate, after setContentView(). */
    public static void setup(Activity activity, int selectedItemId) {
        BottomNavigationView nav = activity.findViewById(R.id.bottomNav);
        if (nav == null) return;

        nav.setSelectedItemId(selectedItemId);   // before the listener, so nothing is triggered

        nav.setOnItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == selectedItemId) return true;   // already on this tab

            if (id == R.id.nav_home) {
                Intent i = new Intent(activity, MainActivity.class);
                // go back to the existing Home screen instead of stacking a new one
                i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                activity.startActivity(i);
                activity.overridePendingTransition(0, 0);
            } else if (id == R.id.nav_cart) {
                activity.startActivity(new Intent(activity, CartActivity.class));
                activity.overridePendingTransition(0, 0);
            } else if (id == R.id.nav_account) {
                Toast.makeText(activity, "Account – coming soon", Toast.LENGTH_SHORT).show();
            }
            return false;   // keep this screen's own tab highlighted
        });

        refreshBadge(activity);
    }

    /** Shows the number of cart items on the Cart tab (hidden when 0). */
    public static void refreshBadge(Activity activity) {
        BottomNavigationView nav = activity.findViewById(R.id.bottomNav);
        if (nav == null) return;

        int count = CartManager.get(activity).getTotalCount();
        if (count > 0) {
            BadgeDrawable badge = nav.getOrCreateBadge(R.id.nav_cart);
            badge.setNumber(count);
            badge.setVisible(true);
        } else {
            nav.removeBadge(R.id.nav_cart);
        }
    }
}
