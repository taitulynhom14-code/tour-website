document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (hamburgerBtn && navbarMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburgerBtn.classList.toggle('is-active');
      navbarMenu.classList.toggle('is-active');
    });

    // Tự động đóng menu khi bấm ra ngoài
    document.addEventListener('click', (e) => {
      if (!navbarMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('is-active');
        navbarMenu.classList.remove('is-active');
      }
    });
  }
});