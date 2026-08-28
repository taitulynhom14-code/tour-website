const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("nav-mobile");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", (e) => {
    // Ngăn chặn sự kiện click lan ra ngoài
    e.stopPropagation();
    mobileMenu.classList.toggle("hidden");

    // Đổi icon giữa 3 gạch và dấu X ngay trên nút
    const icon = mobileMenuButton.querySelector("i");
    if (mobileMenu.classList.contains("hidden")) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    } else {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
    }
  });
}

// Bấm ra ngoài vùng menu thì tự động đóng lại (rất tiện cho người dùng)
window.addEventListener("click", (e) => {
  if (mobileMenu && !mobileMenu.classList.contains("hidden") && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
    mobileMenu.classList.add("hidden");
    const icon = mobileMenuButton.querySelector("i");
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});
export function initHome() {
  // --- 1. SỬA LỖI NÚT "VIEW MORE" ---
  const viewMoreBtns = document.querySelectorAll(".btn-view-more");

  viewMoreBtns.forEach((button) => {
    button.addEventListener("click", function () {
      // DOM: <p class="review-text"> -> <div> -> <button>
      // Do đó reviewText sẽ là thẻ anh em phía trước của thẻ cha (div)
      const reviewText = this.parentElement.previousElementSibling;
      const isClamped = reviewText.classList.contains("line-clamp-2");

      if (isClamped) {
        reviewText.classList.remove("line-clamp-2");
        this.textContent = "View less";
      } else {
        reviewText.classList.add("line-clamp-2");
        this.textContent = "View more";
      }
    });
  });

  // --- 2. THÊM SLIDER TRƯỢT CHO TAB FLIGHTS / STAYS ---
  const tabs = document.querySelectorAll(".booking-tab");
  const indicator = document.getElementById("tab-indicator");
  const formFlight = document.getElementById("form-flight");
  const formStay = document.getElementById("form-stay");

  function moveTabIndicator(tab) {
    if (!indicator) return;
    const contentWidth = tab.clientWidth;
    const leftPosition = tab.offsetLeft;

    indicator.style.width = `${contentWidth}px`;
    indicator.style.transform = `translateX(${leftPosition}px)`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Di chuyển thanh slider
      moveTabIndicator(this);

      // Ẩn/hiện form tương ứng
      if (this.id === "tab-flight") {
        formFlight.classList.remove("hidden");
        formFlight.classList.add("flex");
        formStay.classList.add("hidden");
        formStay.classList.remove("flex");
      } else if (this.id === "tab-stay") {
        formStay.classList.remove("hidden");
        formStay.classList.add("flex");
        formFlight.classList.add("hidden");
        formFlight.classList.remove("flex");
      }
    });
  });

  // Khởi tạo vị trí slider ban đầu (load mặc định tab Flight)
  // setTimeout giúp đảm bảo CSS / Fonts load xong mới tính toán chiều rộng
  setTimeout(() => {
    const defaultTab = document.getElementById("tab-flight");
    if (defaultTab) {
      moveTabIndicator(defaultTab);
    }
  }, 100);

  // --- 3. ĐẢO NGƯỢC ĐỊA ĐIỂM (Giữ nguyên logic cũ của bạn) ---
  window.swapLocations = function (button) {
    const container = button.closest("div.border");
    const input = container.querySelector('input[name="from-to"]');

    if (input && input.value.includes("-")) {
      let parts = input.value.split("-").map((item) => item.trim());
      if (parts.length === 2) {
        input.value = `${parts[1]} - ${parts[0]}`;
      }
    }
  };
}
