export function initHotelListing() {
  const tabs = document.querySelectorAll(".hotel-listing__tab");
  const indicator = document.querySelector(".slide-indicator");
  const listContainer = document.querySelector(".hotel-list-container");

  const sliderMin = document.getElementById("slider-min");
  const sliderMax = document.getElementById("slider-max");
  const sliderFill = document.getElementById("slider-fill");
  const labelMin = document.getElementById("label-min");
  const labelMax = document.getElementById("label-max");
  const minGap = 100; // Khoảng cách giá tối thiểu giữa 2 cục trượt

  let allHotels = [];
  // --- HÀM CHUẨN HÓA ĐƯỜNG DẪN ẢNH (CHỐNG LỖI VỠ ẢNH TRÊN VERCEL) ---
  function getResolvedImageUrl(imagePath) {
    if (!imagePath) return "";
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      return imagePath;
    }
    let cleanPath = imagePath.replace(/^(\.\.\/)+/, "");
    if (cleanPath.startsWith("assets/")) {
      cleanPath = cleanPath.replace("assets/", "");
    }

    try {
      return new URL(`../../${cleanPath}`, import.meta.url).href;
    } catch (e) {
      return imagePath;
    }
  }
  // --- 1. LOGIC THANH TRƯỢT GIÁ ---
  function updateSliderUI() {
    if (!sliderMin || !sliderMax || !sliderFill) return;
    let minVal = parseInt(sliderMin.value);
    let maxVal = parseInt(sliderMax.value);

    labelMin.textContent = "$" + minVal;
    labelMax.textContent = "$" + maxVal;

    const minPercent = ((minVal - sliderMin.min) / (sliderMin.max - sliderMin.min)) * 100;
    const maxPercent = ((maxVal - sliderMax.min) / (sliderMax.max - sliderMax.min)) * 100;

    sliderFill.style.left = minPercent + "%";
    sliderFill.style.width = maxPercent - minPercent + "%";
  }

  if (sliderMin && sliderMax) {
    sliderMin.addEventListener("input", function () {
      let minVal = parseInt(sliderMin.value);
      let maxVal = parseInt(sliderMax.value);
      if (maxVal - minVal < minGap) {
        sliderMin.value = maxVal - minGap;
      }
      updateSliderUI();
    });

    sliderMax.addEventListener("input", function () {
      let minVal = parseInt(sliderMin.value);
      let maxVal = parseInt(sliderMax.value);
      if (maxVal - minVal < minGap) {
        sliderMax.value = minVal + minGap;
      }
      updateSliderUI();
    });

    sliderMin.addEventListener("change", runFilter);
    sliderMax.addEventListener("change", runFilter);

    updateSliderUI();
  }
  // --- 2. LOGIC THANH CHỈ THỊ TAB ---
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
  // --- 3. FETCH DỮ LIỆU TỪ JSON (Chuẩn cho Vercel & Vite) ---
  async function fetchHotels() {
    try {
      const jsonUrl = new URL("../../data/hotels.json", import.meta.url).href;
      const response = await fetch(jsonUrl);
      if (!response.ok) {
        console.error("Lỗi fetch: Không lấy được dữ liệu khách sạn");
        return;
      }

      allHotels = await response.json();

      updateTabCounts();
      runFilter();
    } catch (error) {
      console.error("Lỗi tải dữ liệu hoặc file JSON không tồn tại:", error);
    }
  }
  // --- 4. LỌC VÀ RENDER HTML ĐỘNG ---
  function runFilter() {
    if (!listContainer) return;
    const activeTab = document.querySelector(".hotel-listing__tab--active");
    const currentTabType = activeTab ? activeTab.dataset.target : "hotels-list";
    const minPrice = parseInt(sliderMin.value) || 0;
    const maxPrice = parseInt(sliderMax.value) || 1200;

    const checkedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map((cb) => parseFloat(cb.value));
    const checkedFreebies = Array.from(document.querySelectorAll('input[name="freebies"]:checked')).map((cb) => cb.value);
    const checkedAmenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map((cb) => cb.value);

    const filteredHotels = allHotels.filter((hotel) => {
      const hType = hotel.type || "hotels-list";

      const matchType = hType === currentTabType;
      const matchPrice = hotel.price >= minPrice && hotel.price <= maxPrice;
      const matchRating = checkedRatings.length === 0 || checkedRatings.some((r) => hotel.rating >= r);

      const hotelFreebies = hotel.freebies || [];
      const matchFreebies = checkedFreebies.length === 0 || checkedFreebies.every((f) => hotelFreebies.includes(f));

      const hotelAmenitiesList = hotel.amenities || [];
      const matchAmenities = checkedAmenities.length === 0 || checkedAmenities.every((a) => hotelAmenitiesList.includes(a));

      return matchType && matchPrice && matchRating && matchFreebies && matchAmenities;
    });

    const countDisplay = document.getElementById("result-count");
    if (countDisplay) {
      countDisplay.innerHTML = `Showing ${filteredHotels.length} of <span class="text-slamon">${allHotels.length} places</span>`;
    }

    if (filteredHotels.length === 0) {
      listContainer.innerHTML = `<p class="text-center font-medium mt-10 w-full col-span-full">Không tìm thấy khách sạn nào phù hợp.</p>`;
      return;
    }

    const favoriteIds = JSON.parse(localStorage.getItem("golobe_favorite_hotels")) || [];

    listContainer.innerHTML = filteredHotels
      .map((hotel) => {
        const isFavorited = favoriteIds.includes(hotel.id) ? "checked" : "";

        return `
      <li>
        <article class="hotel-card">
          <div class="relative md:col-span-4 h-64 md:h-auto">
            <img src="${getResolvedImageUrl(hotel.image)}" alt="${hotel.name}" class="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
            <span class="absolute top-2 right-2 flex items-center justify-center px-2 py-1 bg-white/50 backdrop-blur-sm rounded-lg text-sm font-medium text-blackish-green leading-none"> ${hotel.imagesCount || 9} images </span>
          </div>
          <div class="md:col-span-8 flex flex-col justify-between p-6 gap-6">
            <div class="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
              <div class="flex flex-col gap-3">
                <h2 class="text-2xl font-bold text-blackish-green leading-none m-0">${hotel.name}</h2>
                <span class="flex items-center gap-1 text-xs font-medium text-blackish-green/75">
                  <img src="${getResolvedImageUrl("../image/location_light.svg")}" alt="location" class="w-4 h-4" />
                  ${hotel.location}
                </span>
                <div class="flex items-center gap-8 text-xs font-medium text-blackish-green">
                  <span class="flex items-center gap-1">
                    <img src="${getResolvedImageUrl("../image/5-stars.svg")}" alt="5 star" class="w-20" />
                    ${hotel.stars || 5} Star Hotel
                  </span>
                  <span class="flex items-center gap-1">
                    <img src="${getResolvedImageUrl("../image/cafe_light.svg")}" alt="amenities" class="w-4 h-4" />
                    <strong>${hotel.amenitiesCount || 20}+</strong> Amenities
                  </span>
                </div>
                <span class="flex items-center gap-2">
                  <span class="border border-mint-green rounded px-3 py-1.5 text-xs font-medium text-blackish-green">${hotel.rating}</span>
                  <span class="text-xs font-medium text-blackish-green"><strong>${hotel.ratingText || "Very Good"}</strong> ${hotel.reviewsCount} reviews</span>
                </span>
              </div>
              <div class="flex flex-col items-start md:items-end gap-1">
                <span class="text-xs font-medium text-blackish-green/75">starting from</span>
                <div class="flex items-baseline text-slamon">
                  <span class="text-2xl font-bold leading-none">$${hotel.price}</span>
                  <span class="text-sm font-bold leading-none">/night</span>
                </div>
                <span class="text-xs font-medium text-blackish-green/75">excl. tax</span>
              </div>
            </div>
            <div class="w-full h-px bg-blackish-green/25"></div>
            <div class="flex gap-4">
              <label class="btn-favorite group">
                <input type="checkbox" class="peer hidden favorite-checkbox" data-id="${hotel.id}" ${isFavorited} />
                <div class="w-5 h-5 bg-[url('../image/heart_uncheck.svg')] bg-center bg-contain bg-no-repeat peer-checked:bg-[url('../image/heart_light.svg')] transition-all"></div>
                <div class="absolute inset-0 bg-mint-green rounded -z-10 opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </label>
              <a href="hotel-detail-page.html?id=${hotel.id}" class="btn-view-place"> View Place </a>
            </div>
          </div>
        </article>
      </li>
    `;
      })
      .join("");

    attachFavoriteEvents();
  }
  // --- 5. LOGIC THÊM/XÓA YÊU THÍCH ---
  function attachFavoriteEvents() {
    const favoriteCheckboxes = document.querySelectorAll(".favorite-checkbox");

    favoriteCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-id");
        let favorites = JSON.parse(localStorage.getItem("golobe_favorite_hotels")) || [];

        if (e.target.checked) {
          if (!favorites.includes(id)) favorites.push(id);
        } else {
          favorites = favorites.filter((favId) => favId !== id);
        }

        localStorage.setItem("golobe_favorite_hotels", JSON.stringify(favorites));
      });
    });
  }
  // --- 6. GẮN SỰ KIỆN CHO TABS VÀ RATING ---
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("hotel-listing__tab--active"));
      this.classList.add("hotel-listing__tab--active");
      moveIndicator(this);
      runFilter();
    });
  });

  window.addEventListener("load", () => {
    const activeTab = document.querySelector(".hotel-listing__tab--active");
    if (activeTab) moveIndicator(activeTab);
  });
  // --- HÀM CẬP NHẬT SỐ LƯỢNG TRÊN TAB ---
  function updateTabCounts() {
    const tabs = document.querySelectorAll(".hotel-listing__tab");

    tabs.forEach((tab) => {
      const targetType = tab.getAttribute("data-target");
      const count = allHotels.filter((hotel) => {
        const hType = hotel.type || "hotels-list";
        return hType === targetType;
      }).length;

      const countText = tab.querySelector("p");
      if (countText) {
        countText.textContent = `${count} places`;
      }
    });
  }

  fetchHotels();
  // --- LOGIC CHỌN RATING LIÊN HOÀN ---
  let currentBaseRating = null;

  document.querySelectorAll('input[name="rating"]').forEach((cb) => {
    cb.addEventListener("click", function () {
      const clickedValue = parseInt(this.value);

      if (currentBaseRating === clickedValue) {
        document.querySelectorAll('input[name="rating"]').forEach((otherCb) => {
          otherCb.checked = false;
        });
        currentBaseRating = null;
      } else {
        document.querySelectorAll('input[name="rating"]').forEach((otherCb) => {
          const otherValue = parseInt(otherCb.value);
          otherCb.checked = otherValue >= clickedValue;
        });
        currentBaseRating = clickedValue;
      }

      runFilter();
    });
  });

  document.querySelectorAll('input[name="freebies"]').forEach((cb) => {
    cb.addEventListener("change", runFilter);
  });

  document.querySelectorAll('input[name="amenities"]').forEach((cb) => {
    cb.addEventListener("change", runFilter);
  });
}

