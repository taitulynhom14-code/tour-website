import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        favorites: resolve(__dirname, "favorites.html"),

        "find-flight": resolve(__dirname, "flight-flow/find-flight.html"),
        "flight-booking-detail": resolve(__dirname, "flight-flow/flight-booking-detail.html"),
        "flight-detail-page": resolve(__dirname, "flight-flow/flight-detail-page.html"),
        "flight-listing": resolve(__dirname, "flight-flow/flight-listing.html"),

        "find-stays": resolve(__dirname, "hotel-flow/find-stays.html"),
        "hotel-booking-detail": resolve(__dirname, "hotel-flow/hotel-booking-detail.html"),
        "hotel-detail-page": resolve(__dirname, "hotel-flow/hotel-detail-page.html"),
        "hotel-listing": resolve(__dirname, "hotel-flow/hotel-listing.html"),

        account: resolve(__dirname, "login-signup/account.html"),
        forgotpass: resolve(__dirname, "login-signup/forgotpass.html"),
        "forgotpass_set-new": resolve(__dirname, "login-signup/forgotpass_set-new.html"),
        forgotpass_verify: resolve(__dirname, "login-signup/forgotpass_verify.html"),
        login: resolve(__dirname, "login-signup/login.html"),
        signup: resolve(__dirname, "login-signup/signup.html"),
        "signup_payment-methods": resolve(__dirname, "login-signup/signup_payment-methods.html"),
      },
    },
  },
});
