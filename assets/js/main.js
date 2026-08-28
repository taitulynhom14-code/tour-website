import { initNav } from "./modules/header-nav.js";
import { initGlobalAuth } from "./modules/global-auth.js";
import { initLogin } from "./modules/login.js";
import { initHome } from "./modules/index.js";
import { initHotelListing } from "./modules/hotel-listing.js";
import { initFavorites } from "./modules/favourites.js";
import { initBookingDetail } from "./modules/booking-detail.js";
import { initSignup, initSignupPayment } from "./modules/signup.js";
import { initSearchValidation } from "./modules/search-validation.js";
import { initFlightListing } from "./modules/flight-listing.js";
import { initFlightSearchValidation } from "./modules/flight-search-validation.js";
import { initAccountTabs } from "./modules/account.js";

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initGlobalAuth();

  const path = window.location.pathname;

  if (path.endsWith("/") || path.includes("index.html")) {
    initHome();
  }

  if (path.includes("login.html") || path.includes("forgotpass")) {
    initLogin();
  }

  if (path.includes("signup_payment-methods.html") || path.includes("add-payment.html")) {
    initLogin();
    initSignupPayment();
  }

  if (path.includes("signup.html")) {
    initSignup();
  }

  if (path.includes("favorites.html")) {
    initFavorites();
  }

  if (path.includes("hotel-booking-detail.html") || path.includes("flight-booking-detail.html")) {
    initBookingDetail();
  }

  if (path.includes("hotel-listing.html")) {
    initHotelListing();
  }

  if (path.endsWith("/") || path.includes("index.html") || path.includes("find-stays.html") || path.includes("hotel-listing.html")) {
    initSearchValidation();
  }

  if (path.includes("flight-listing.html")) {
    initFlightListing();
  }

  if (path.endsWith("/") || path.includes("index.html") || path.includes("find-flights.html") || path.includes("flight-listing.html")) {
    initFlightSearchValidation();
  }
  if (path.includes("account.html")) {
    initAccountTabs();
  }
});
