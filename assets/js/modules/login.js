export function initLogin() {
  // 1. XỬ LÝ BANNER SLIDER (Trượt ảnh tự động)
  const sliderTrack = document.getElementById("login-slider");
  const dots = document.querySelectorAll(".slider-dot");

  if (sliderTrack && dots.length > 0) {
    const images = sliderTrack.querySelectorAll("img");

    if (images.length > 0) {
      // Nhân bản ảnh đầu tiên đặt vào cuối cùng để tạo hiệu ứng vòng lặp
      const firstClone = images[0].cloneNode(true);
      sliderTrack.appendChild(firstClone);

      let currentSlide = 0;
      const totalDots = dots.length;
      let slideInterval;
      let isTransitioning = false;

      function updateDots(index) {
        const dotIndex = index === totalDots ? 0 : index;
        dots.forEach((dot, i) => {
          if (i === dotIndex) {
            dot.className = "slider-dot w-6 h-2 bg-mint-green rounded-full cursor-pointer transition-all duration-300";
          } else {
            dot.className = "slider-dot w-2 h-2 bg-white/70 hover:bg-white rounded-full cursor-pointer transition-all duration-300";
          }
        });
      }

      function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentSlide = index;

        sliderTrack.style.transition = "transform 700ms ease-in-out";
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        updateDots(currentSlide);
        sliderTrack.addEventListener("transitionend", handleTransitionEnd);
      }

      function handleTransitionEnd() {
        isTransitioning = false;
        sliderTrack.removeEventListener("transitionend", handleTransitionEnd);

        // Nhảy về ảnh số 0 không cần animation nếu ở ảnh clone cuối
        if (currentSlide === totalDots) {
          sliderTrack.style.transition = "none";
          currentSlide = 0;
          sliderTrack.style.transform = `translateX(0%)`;
        }
      }

      function nextSlide() {
        if (isTransitioning) return;
        goToSlide(currentSlide + 1);
      }

      function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 3500);
      }

      function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
      }

      dots.forEach((dot) => {
        dot.addEventListener("click", function () {
          const slideIndex = parseInt(this.getAttribute("data-slide"));
          if (slideIndex !== currentSlide) {
            goToSlide(slideIndex);
            resetAutoSlide();
          }
        });
      });

      startAutoSlide();
    }
  }

  // 2. XỬ LÝ ẨN / HIỆN MẬT KHẨU (TOGGLE PASSWORD)
  const passwordInput = document.getElementById("login-password");
  const togglePasswordBtn = passwordInput ? passwordInput.nextElementSibling : null;

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Tránh form bị submit ngẫu nhiên
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");

      const img = togglePasswordBtn.querySelector("img");
      if (img) {
        img.style.opacity = isPassword ? "1" : "0.75";
      }
    });
  }

  // 3. XỬ LÝ LOGIC ĐĂNG NHẬP (LOGIN AUTHENTICATION)
  const btnLogin = document.getElementById("btn-login");
  const emailInput = document.getElementById("login-email");

  if (btnLogin) {
    btnLogin.addEventListener("click", function (e) {
      e.preventDefault();

      const email = emailInput ? emailInput.value.trim() : "";
      const password = passwordInput ? passwordInput.value.trim() : "";

      if (!email || !password) {
        alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        return;
      }

      // Lấy danh sách tài khoản đã đăng ký (từ trang signup)
      const users = JSON.parse(localStorage.getItem("golobe_db_users")) || [];

      // Kiểm tra khớp thông tin (Cho phép xài tk demo john.doe mặc định)
      let validUser = users.find((u) => u.email === email && u.password === password);

      if (!validUser && email === "john.doe@gmail.com") {
        validUser = {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@gmail.com",
          phone: "0123456789",
        };
      }

      if (validUser) {
        const currentUserData = {
          isLoggedIn: true,
          name: `${validUser.firstName} ${validUser.lastName}`,
          email: validUser.email,
          phone: validUser.phone,
          avatar: "/assets/image/user-avt.png",
        };

        // Ghi nhận trạng thái đăng nhập vào Local Storage
        localStorage.setItem("golobe_current_user", JSON.stringify(currentUserData));

        alert("Đăng nhập thành công!");
        window.location.href = "../index.html";
      } else {
        alert("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
      }
    });
  }
}
