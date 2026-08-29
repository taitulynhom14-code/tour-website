export function initNav() {
  const mobileToggle = document.querySelector('[aria-controls="nav-mobile"]');
  const mobileMenu = document.getElementById("nav-mobile");
  const userStr = localStorage.getItem("golobe_current_user");

  if (userStr) {
    const user = JSON.parse(userStr);

    const displayUserName = document.getElementById("display-user-name");
    if (displayUserName) {
      displayUserName.textContent = user.name;
    }

    const dropdownUserName = document.getElementById("dropdown-user-name");
    if (dropdownUserName) {
      // Thêm dấu chấm phía sau cho giống với thiết kế gốc
      dropdownUserName.textContent = user.name + ".";
    }
  }

  function setMobileOpen(open) {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.toggle("hidden", !open);
    mobileToggle.setAttribute("aria-expanded", String(open));
    mobileToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  const isMobileOpen = () => mobileToggle?.getAttribute("aria-expanded") === "true";

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMobileOpen(!isMobileOpen());
    });
  }

  const userToggle = document.getElementById("user-menu-button");
  const userMenu = document.getElementById("user-dropdown");

  function setUserOpen(open) {
    if (!userMenu || !userToggle) return;
    if (open) {
      userMenu.classList.remove("hidden");
      userMenu.classList.add("flex");
    } else {
      userMenu.classList.add("hidden");
      userMenu.classList.remove("flex");
    }
    userToggle.setAttribute("aria-expanded", String(open));
  }
  const isUserOpen = () => userToggle?.getAttribute("aria-expanded") === "true";

  if (userToggle) {
    userToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setUserOpen(!isUserOpen());
    });
  }

  document.addEventListener("click", (e) => {
    if (isMobileOpen() && !e.target.closest("#nav-mobile") && !e.target.closest('[aria-controls="nav-mobile"]')) {
      setMobileOpen(false);
    }
    if (isUserOpen() && !e.target.closest("#user-dropdown") && !e.target.closest("#user-menu-button")) {
      setUserOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isMobileOpen()) setMobileOpen(false);
      if (isUserOpen()) setUserOpen(false);
    }
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
    if (e.matches && isMobileOpen()) setMobileOpen(false);
  });
}
