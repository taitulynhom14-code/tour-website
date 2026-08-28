export function initGlobalAuth() {
  const currentUser = JSON.parse(localStorage.getItem("golobe_current_user"));

  // Các phần tử giao diện Auth
  const guestMenu = document.getElementById("guest-menu");
  const loggedInMenu = document.getElementById("logged-in-menu");
  const displayUserName = document.getElementById("display-user-name");
  const displayUserNameDropdown = document.getElementById("display-user-name-dropdown");
  const displayUserAvatar = document.getElementById("display-user-avatar");

  // Các phần tử menu Responsive
  const userMenuBtn = document.getElementById("user-menu-button");
  const userDropdown = document.getElementById("user-dropdown");
  
  // Phần tử của Menu 3 gạch (Hamburger)
  const mobileMenuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu"); 

  // 1. ĐỒNG BỘ HIỂN THỊ HEADER & THÔNG TIN USER
  if (currentUser && currentUser.isLoggedIn) {
    if (guestMenu) guestMenu.classList.add("hidden");
    if (loggedInMenu) {
      loggedInMenu.classList.remove("hidden");
      loggedInMenu.classList.add("flex");
    }

    if (displayUserName) displayUserName.textContent = currentUser.name;
    if (displayUserNameDropdown) displayUserNameDropdown.textContent = currentUser.name;

    if (displayUserAvatar && currentUser.avatar) {
      if (currentUser.avatar.startsWith("http")) {
        displayUserAvatar.src = currentUser.avatar;
      } else {
        const fileName = currentUser.avatar.split('/').pop();
        const absoluteAvatarUrl = new URL(`../../image/${fileName}`, import.meta.url).href;
        displayUserAvatar.src = absoluteAvatarUrl;
        
        displayUserAvatar.onerror = function () {
          this.src = new URL(`../../image/default-avatar.png`, import.meta.url).href;
        };
      }
    }
  }

  // 2. XỬ LÝ DROPDOWN USER (DESKTOP & MOBILE)
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      if (mobileMenu) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }
      userDropdown.classList.toggle("hidden");
      userDropdown.classList.toggle("flex");
    });
  }

  // 3. XỬ LÝ MENU ĐIỆN THOẠI (DẤU 3 GẠCH)
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài document
      console.log("Nút 3 gạch đã được bấm thành công!"); // Kiểm tra trực tiếp trên F12 -> Console

      // Đóng user dropdown nếu đang mở để tránh đè giao diện[cite: 16]
      if (userDropdown && !userDropdown.classList.contains("hidden")) {
        userDropdown.classList.add("hidden");
        userDropdown.classList.remove("flex");
      }
      
      // Bật/tắt menu di động[cite: 16]
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
    });
  }

  // 4. TỰ ĐỘNG ĐÓNG MENU KHI CLICK RA NGOÀI MÀN HÌNH
  document.addEventListener("click", (e) => {
    // Đóng User Dropdown
    if (userDropdown && userMenuBtn && !userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
      userDropdown.classList.add("hidden");
      userDropdown.classList.remove("flex");
    }
    
    // Đóng Mobile Menu (Menu 3 gạch)
    if (mobileMenu && mobileMenuBtn && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    }
  });

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