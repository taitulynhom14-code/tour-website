export async function initFavorites() {
  const container = document.getElementById("favorites-list");
  if (!container) return;

  const tabs = document.querySelectorAll(".hotel-listing__tab");
  const indicator = document.querySelector(".slide-indicator"); // Thêm biến indicator
  let currentTab = "places-list";

  let allHotels = [];
  let allFlights = [];

  // --- HÀM ANIMATION TRƯỢT TAB ---
  function moveIndicator(tab) {
    if (!indicator) return;
    const tabStyle = window.getComputedStyle(tab);
    const paddingLeft = parseFloat(tabStyle.paddingLeft);
    const paddingRight = parseFloat(tabStyle.paddingRight);

    const contentWidth = tab.clientWidth - paddingLeft - paddingRight;
    const tableLeft = tab.offsetLeft + paddingLeft;

    indicator.style.width = `${contentWidth}px`;
    indicator.style.transform = `translateX(${tableLeft}px)`;
  }

  // --- 1. LẤY SỐ LƯỢNG VÀ CẬP NHẬT TRÊN TAB ---
  function updateTabCounts() {
    const hotelIds = JSON.parse(localStorage.getItem("golobe_favorite_hotels")) || [];
    const flightIds = JSON.parse(localStorage.getItem("golobe_favorite_flights")) || [];

    const placesCountText = document.querySelector('[data-target="places-list"] p');
    const flightsCountText = document.querySelector('[data-target="flights-list"] p');

    if (placesCountText) placesCountText.textContent = `${hotelIds.length} marked`;
    if (flightsCountText) flightsCountText.textContent = `${flightIds.length} marked`;
  }

  // --- 2. FETCH CÙNG LÚC 2 FILE JSON ---
  try {
    const [resHotels, resFlights] = await Promise.all([fetch("../assets/data/hotels.json?v=" + new Date().getTime()), fetch("../assets/data/flights.json?v=" + new Date().getTime())]);
    if (resHotels.ok) allHotels = await resHotels.json();
    if (resFlights.ok) allFlights = await resFlights.json();
  } catch (err) {
    console.error("Lỗi fetch dữ liệu yêu thích:", err);
  }

  // --- 3. HÀM RENDER CHÍNH ---
  function renderCurrentTab() {
    updateTabCounts();

    if (currentTab === "places-list") {
      // RENDERING KHÁCH SẠN
      const hotelIds = JSON.parse(localStorage.getItem("golobe_favorite_hotels")) || [];
      if (hotelIds.length === 0) {
        container.innerHTML = `<li class="text-center py-12 text-blackish-green/60 font-medium">Bạn chưa có khách sạn yêu thích nào trong danh sách.</li>`;
        return;
      }

      const favHotels = allHotels.filter((hotel) => hotelIds.includes(hotel.id));
      container.innerHTML = favHotels
        .map(
          (hotel) => /* Cấu trúc HTML thẻ khách sạn (giữ nguyên như trước) */ `
        <li>
          <article class="grid grid-cols-1 md:grid-cols-3 bg-white rounded-xl shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] overflow-hidden">
            <div class="relative w-full h-64 md:h-full min-h-60">
              <img src="${hotel.image}" alt="${hotel.name}" class="absolute inset-0 w-full h-full object-cover" />
              <span class="absolute top-4 right-4 flex items-center justify-center px-2 py-1 bg-white/75 backdrop-blur-sm rounded text-xs font-semibold text-blackish-green leading-none">${hotel.imagesCount || 9} images</span>
            </div>
            <div class="md:col-span-2 flex flex-col p-6">
              <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div class="flex flex-col gap-3">
                  <h2 class="text-2xl font-bold text-blackish-green leading-none m-0 pr-4">${hotel.name}</h2>
                  <span class="flex items-center gap-1 text-sm font-medium text-blackish-green/75">
                    <img src="../assets/image/location_light.svg" alt="location" class="w-4 h-4 shrink-0" />
                    ${hotel.location}
                  </span>
                  <div class="flex items-center gap-6 mt-1">
                    <span class="flex items-center gap-1 text-sm font-medium text-blackish-green">
                      <img src="../assets/image/5-stars.svg" alt="5 star" class="w-16" />
                      ${hotel.stars || 5} Star Hotel
                    </span>
                    <span class="flex items-center gap-2 text-sm font-medium text-blackish-green">
                      <img src="../assets/image/cafe_light.svg" alt="amenities" class="w-4 h-4 shrink-0" />
                      <strong>${hotel.amenitiesCount || 20}+</strong> Amenities
                    </span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="border border-mint-green rounded px-2 py-1 text-sm font-medium text-blackish-green">${hotel.rating}</span>
                    <span class="text-sm font-medium text-blackish-green"><strong>${hotel.ratingText || "Very Good"}</strong> ${hotel.reviewsCount} reviews</span>
                  </div>
                </div>
                <div class="flex flex-col items-start md:items-end gap-1 shrink-0">
                  <span class="text-xs font-medium text-blackish-green/75">starting from</span>
                  <div class="flex items-baseline text-slamon">
                    <span class="text-3xl font-bold leading-none">$${hotel.price}</span>
                    <span class="text-sm font-bold leading-none">/night</span>
                  </div>
                  <span class="text-xs font-medium text-blackish-green/75">excl. tax</span>
                </div>
              </div>
              <div class="mt-auto">
                <div class="w-full h-px bg-blackish-green/25 mb-6"></div>
                <div class="flex gap-4">
                  <label class="btn-favorite group relative flex justify-center items-center h-12 w-12 border border-mint-green rounded cursor-pointer shrink-0">
                    <input type="checkbox" class="peer hidden" data-id="${hotel.id}" checked />
                    <div class="w-5 h-5 bg-[url('../image/heart_dark.svg')] bg-center bg-contain bg-no-repeat peer-checked:bg-[url('../image/heart_light.svg')] transition-all z-10"></div>
                    <div class="absolute inset-0 bg-mint-green rounded -z-10 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                  </label>
                  <a href="hotel-detail-page.html?id=${hotel.id}" class="btn-view-place no-underline flex-1 flex justify-center items-center">View Place</a>
                </div>
              </div>
            </div>
          </article>
        </li>
      `,
        )
        .join("");
      attachUnfavoriteEvent("golobe_favorite_hotels", "places-list");
    } else if (currentTab === "flights-list") {
      // RENDERING CHUYẾN BAY
      const flightIds = JSON.parse(localStorage.getItem("golobe_favorite_flights")) || [];
      if (flightIds.length === 0) {
        container.innerHTML = `<li class="text-center py-12 text-blackish-green/60 font-medium">Bạn chưa có chuyến bay yêu thích nào trong danh sách.</li>`;
        return;
      }

      const favFlights = allFlights.filter((flight) => flightIds.includes(flight.id));
      container.innerHTML = favFlights
        .map(
          (ticket) => /* Cấu trúc HTML vé chuyến bay (giữ nguyên như trước) */ `
        <li>
          <article class="flex flex-col md:flex-row bg-white rounded-xl shadow-[0_4px_16px_0_rgba(17,34,17,0.05)] p-4 md:p-6 gap-4 md:gap-6 relative overflow-hidden">
            <div class="w-24 md:w-40 mx-auto md:mx-0 shrink-0 flex items-center justify-center">
              <img class="w-full object-contain max-h-16" src="${ticket.airlineLogo}" alt="${ticket.airlineName}" />
            </div>
            <div class="flex-1 flex flex-col justify-between gap-4 md:gap-6 min-w-0">
              <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                <div class="flex items-center gap-2">
                  <span class="border border-mint-green text-blackish-green text-xs font-bold px-3 py-1.5 rounded">${ticket.rating}</span>
                  <p class="m-0 text-xs font-medium text-blackish-green flex flex-wrap gap-1">
                    <strong class="">${ticket.ratingText}</strong>
                    <span class="font-normal opacity-75">${ticket.reviewsCount} reviews</span>
                  </p>
                </div>
                <div class="flex flex-col items-start sm:items-end gap-1">
                  <span class="text-xs font-medium text-blackish-green/75">starting from</span>
                  <div class="flex items-baseline text-slamon">
                    <span class="text-xl md:text-2xl font-bold leading-none">$${ticket.price}</span>
                    <span class="text-sm font-bold leading-none ml-1">${ticket.priceUnit || ""}</span>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-4">
                ${ticket.flights
                  .map(
                    (f) => `
                  <div class="flex justify-between md:justify-start gap-2 md:gap-10 w-full">
                    <input type="checkbox" class="appearance-none w-4 h-4 md:w-5 md:h-5 border-2 border-blackish-green/40 rounded-sm checked:border-mint-green checked:bg-mint-green checked:bg-[url('../image/check_success.svg')] bg-center bg-no-repeat transition-all cursor-pointer shrink-0" >
                    <div class="flex flex-col justify-center flex-1 md:flex-none">
                      <strong class="text-[11px] sm:text-[14px] md:text-base text-blackish-green font-semibold leading-tight">${f.time}</strong>
                      <span class="text-[10px] sm:text-[12px] md:text-sm text-blackish-green/50 mt-1">${f.airline}</span>
                    </div>
                    <div class="text-[10px] sm:text-[13px] md:text-sm font-semibold text-blackish-green/75 shrink-0 text-center px-1">${f.type}</div>
                    <div class="flex flex-col justify-center flex-1 md:flex-none text-right md:text-left">
                      <strong class="text-[11px] sm:text-[14px] md:text-base text-blackish-green font-semibold leading-tight">${f.duration}</strong>
                      <span class="text-[10px] sm:text-[12px] md:text-sm text-blackish-green/50 mt-1">${f.route}</span>
                    </div>
                  </div>
                `,
                  )
                  .join("")}
              </div>
              <div class="w-full h-px bg-blackish-green/25 mt-2 mb-1 md:my-0"></div>
              <div class="flex flex-row gap-4 items-stretch">
                <label class="btn-favorite group relative flex justify-center items-center h-12 w-12 border border-mint-green rounded cursor-pointer shrink-0">
                  <input type="checkbox" class="peer hidden" data-id="${ticket.id}" checked />
                  <div class="w-5 h-5 bg-[url('../image/heart_dark.svg')] bg-center bg-contain bg-no-repeat peer-checked:bg-[url('../image/heart_light.svg')] transition-all z-10"></div>
                </label>
                <a href="flight-detail-page.html?id=${ticket.id}" class="flex-1 flex justify-center items-center h-12 bg-mint-green hover:opacity-80 transition-opacity rounded text-blackish-green text-sm font-semibold no-underline"> View Deals </a>
              </div>
            </div>
          </article>
        </li>
      `,
        )
        .join("");
      attachUnfavoriteEvent("golobe_favorite_flights", "flights-list");
    }
  }

  // --- 4. SỰ KIỆN CLICK CHUYỂN TAB ---
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("hotel-listing__tab--active"));
      tab.classList.add("hotel-listing__tab--active");

      moveIndicator(tab); // Gọi hàm trượt khi click

      currentTab = tab.getAttribute("data-target");
      renderCurrentTab();
    });
  });

  // Khởi tạo vị trí thanh trượt khi vừa vào trang
  setTimeout(() => {
    const activeTab = document.querySelector(".hotel-listing__tab--active");
    if (activeTab) moveIndicator(activeTab);
  }, 0);
  // --- 5. LOGIC GỠ YÊU THÍCH ---
  function attachUnfavoriteEvent(storageKey, tabTarget) {
    const checkboxes = document.querySelectorAll("#favorites-list .btn-favorite input");

    checkboxes.forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        let favoriteIds = JSON.parse(localStorage.getItem(storageKey)) || [];

        favoriteIds = favoriteIds.filter((favId) => favId !== id);
        localStorage.setItem(storageKey, JSON.stringify(favoriteIds));

        const liCard = e.target.closest("li");
        if (liCard) liCard.remove();

        updateTabCounts();

        if (favoriteIds.length === 0) {
          const typeName = tabTarget === "places-list" ? "khách sạn" : "chuyến bay";
          container.innerHTML = `<li class="text-center py-12 text-blackish-green/60 font-medium">Bạn chưa có ${typeName} yêu thích nào trong danh sách.</li>`;
        }
      });
    });
  }

  renderCurrentTab();
}
