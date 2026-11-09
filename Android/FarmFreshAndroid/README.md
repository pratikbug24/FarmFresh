# FarmFresh – Android (Java)

Native Android port of the FarmFresh fruit-shop website.

## Open in Android Studio
1. Android Studio -> File -> Open -> select the `FarmFreshAndroid` folder.
2. Wait for Gradle sync (Android Studio will offer to create the Gradle wrapper / update the plugin version if needed).
3. Run on an emulator or phone.

## Structure
- ProductRepository  – product list (swap for your PHP/MySQL API)
- CartManager        – cart logic + SharedPreferences persistence
- MainActivity       – product grid, search, cart bar
- CartActivity       – quantity +/-, remove, totals, place order
