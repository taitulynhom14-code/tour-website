export function initSignup() {
  // 1. XỬ LÝ BANNER SLIDER (Trượt ảnh tự động)
  const sliderTrack = document.getElementById("login-slider");
  const dots = document.querySelectorAll(".slider-dot");

  if (sliderTrack && dots.length > 0) {
    const images = sliderTrack.querySelectorAll("img");

    if (images.length > 0) {
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
  const toggleBtns = document.querySelectorAll(".btn-toggle-password");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const input = btn.previousElementSibling;
      const isPassword = input.getAttribute("type") === "password";

      input.setAttribute("type", isPassword ? "text" : "password");

      const img = btn.querySelector("img");
      if (img) {
        img.style.opacity = isPassword ? "1" : "0.75";
      }
    });
  });

  // 3. XỬ LÝ LOGIC ĐĂNG KÝ (SIGNUP AUTHENTICATION)
  const btnSignup = document.getElementById("btn-signup");

  if (btnSignup) {
    btnSignup.addEventListener("click", (e) => {
      e.preventDefault();

      const firstName = document.getElementById("signup-firstname").value.trim();
      const lastName = document.getElementById("signup-lastname").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const phone = document.getElementById("signup-phone").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;
      const termsChecked = document.getElementById("signup-terms").checked;

      // 1. Kiểm tra tính hợp lệ của dữ liệu đầu vào
      if (!firstName || !lastName || !email || !phone || !password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      if (!termsChecked) {
        alert("Bạn phải đồng ý với Điều khoản và Chính sách bảo mật!");
        return;
      }

      // Lấy danh sách users từ localStorage
      let users = JSON.parse(localStorage.getItem("golobe_db_users")) || [];

      // Kiểm tra xem email đã tồn tại chưa
      const isExist = users.some((u) => u.email === email);
      if (isExist) {
        alert("Email này đã được đăng ký! Vui lòng dùng email khác.");
        return;
      }

      // Lưu tạm thông tin người dùng đang đăng ký vào Session Storage (hoặc Local Storage)
      // Để trang add-payment.html có thể lấy và hoàn tất quá trình tạo tài khoản
      const pendingUser = { firstName, lastName, email, phone, password };
      sessionStorage.setItem("golobe_pending_user", JSON.stringify(pendingUser));

      // Chuyển hướng đến trang thêm phương thức thanh toán
      // SỬA LẠI TÊN FILE TẠI ĐÂY
      window.location.href = "signup_payment-methods.html";
    });
  }
}

export function initSignupPayment() {
  const btnComplete = document.getElementById("btn-complete-signup");

  if (btnComplete) {
    btnComplete.addEventListener("click", (e) => {
      e.preventDefault();

      const pendingUserStr = sessionStorage.getItem("golobe_pending_user");
      if (!pendingUserStr) {
        alert("Lỗi: Không tìm thấy thông tin đăng ký. Vui lòng quay lại bước 1!");
        window.location.href = "signup.html";
        return;
      }

      const pendingUser = JSON.parse(pendingUserStr);
      let users = JSON.parse(localStorage.getItem("golobe_db_users")) || [];

      // Lưu user vào Database chính và dọn dẹp bộ nhớ tạm
      users.push(pendingUser);
      localStorage.setItem("golobe_db_users", JSON.stringify(users));
      sessionStorage.removeItem("golobe_pending_user");

      alert("Hoàn tất đăng ký và thêm thẻ! Vui lòng đăng nhập.");
      window.location.href = "login.html";
    });
  }
}
