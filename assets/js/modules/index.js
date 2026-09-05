export function initGlobalAuth() {
  const currentUser = JSON.parse(localStorage.getItem("golobe_current_user"));

  // Các phần tử giao diện Auth
  const guestMenu = document.getElementById("guest-menu");
  const loggedInMenu = document.getElementById("logged-in-menu");
  const displayUserName = document.getElementById("display-user-name");

  // Đã sửa ID ở đây cho khớp với HTML của bạn
  const displayUserNameDropdown = document.getElementById("dropdown-user-name");
  const displayUserAvatar = document.getElementById("display-user-avatar");

  // 1. ĐỒNG BỘ HIỂN THỊ HEADER & THÔNG TIN USER
  if (currentUser && currentUser.isLoggedIn) {
    if (guestMenu) guestMenu.classList.add("hidden");
    if (loggedInMenu) {
      loggedInMenu.classList.remove("hidden");
      loggedInMenu.classList.add("flex");
    }

    if (displayUserName) displayUserName.textContent = currentUser.name;
    // Thêm dấu chấm cho giống định dạng gốc
    if (displayUserNameDropdown) displayUserNameDropdown.textContent = currentUser.name + ".";

    if (displayUserAvatar && currentUser.avatar) {
      if (currentUser.avatar.startsWith("http")) {
        displayUserAvatar.src = currentUser.avatar;
      } else {
        const fileName = currentUser.avatar.split("/").pop();
        const absoluteAvatarUrl = new URL(`../../image/${fileName}`, import.meta.url).href;
        displayUserAvatar.src = absoluteAvatarUrl;

        displayUserAvatar.onerror = function () {
          this.src = new URL(`../../image/default-avatar.png`, import.meta.url).href;
        };
      }
    }
  }

  // LƯU Ý: Đã xóa phần 2, 3, 4 (Xử lý đóng mở Menu/Dropdown) ở đây vì file header-nav.js đã đảm nhiệm việc đó rồi. Việc để cả hai sẽ gây xung đột không mở được dropdown.

  // 5. XỬ LÝ LỆNH ĐĂNG XUẤT (LOGOUT)
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("golobe_current_user");
      alert("Đã đăng xuất thành công!");
      window.location.reload();
    });
  }
}
export function initHome() {
  // --- 1. SỬA LỖI NÚT "VIEW MORE" ---
  const viewMoreBtns = document.querySelectorAll(".btn-view-more");

  viewMoreBtns.forEach((button) => {
    button.addEventListener("click", function () {
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
      moveTabIndicator(this);

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

  setTimeout(() => {
    const defaultTab = document.getElementById("tab-flight");
    if (defaultTab) {
      moveTabIndicator(defaultTab);
    }
  }, 100);

  // --- 3. ĐẢO NGƯỢC ĐỊA ĐIỂM ---
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

