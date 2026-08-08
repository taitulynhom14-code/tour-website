// ==========================================
// 1. XỬ LÝ PRICE SLIDER
// ==========================================
const sliderMin = document.getElementById("slider-min");
const sliderMax = document.getElementById("slider-max");
const sliderFill = document.getElementById("slider-fill");
const labelMin = document.getElementById("label-min");
const labelMax = document.getElementById("label-max");
const minGap = 210;

if (sliderMin && sliderMax) {
  function updateSliderUI() {
    let minVal = parseInt(sliderMin.value);
    let maxVal = parseInt(sliderMax.value);

    labelMin.textContent = "$" + minVal;
    labelMax.textContent = "$" + maxVal;

    const minPercent = ((minVal - sliderMin.min) / (sliderMin.max - sliderMin.min)) * 100;
    const maxPercent = ((maxVal - sliderMax.min) / (sliderMax.max - sliderMax.min)) * 100;

    sliderFill.style.left = minPercent + "%";
    sliderFill.style.width = maxPercent - minPercent + "%";
  }

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

  updateSliderUI();
}

// ==========================================
// 2. XỬ LÝ SORT DROPDOWN
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("sort-dropdown");

  if (dropdown) {
    const trigger = dropdown.querySelector(".sort-dropdown__trigger");
    const options = dropdown.querySelectorAll(".sort-dropdown__option");
    const selectedText = dropdown.querySelector(".sort-dropdown__selected");
    const hiddenInput = document.getElementById("sort-input");

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("is-open");
    });

    options.forEach((option) => {
      option.addEventListener("click", function () {
        const text = this.textContent;
        const value = this.getAttribute("data-value");

        selectedText.textContent = text;
        if (hiddenInput) hiddenInput.value = value;

        options.forEach((opt) => opt.classList.remove("sort-dropdown__option--active"));
        this.classList.add("sort-dropdown__option--active");
        dropdown.classList.remove("is-open");
      });
    });

    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
      }
    });
  }
});

// ==========================================
// 3. XỬ LÝ TAB & SLIDE INDICATOR
// ==========================================
const tabs = document.querySelectorAll(".hotel-listing__tab");
const indicator = document.querySelector(".slide-indicator");

function moveIndicator(tab) {
  if (!indicator) return; // Bảo vệ nếu không có thanh indicator

  const tabStyle = window.getComputedStyle(tab);
  const paddingLeft = parseFloat(tabStyle.paddingLeft);
  const paddingRight = parseFloat(tabStyle.paddingRight);

  const contentWidth = tab.clientWidth - paddingLeft - paddingRight;
  const tabLeft = tab.offsetLeft + paddingLeft;

  indicator.style.width = `${contentWidth}px`;
  indicator.style.transform = `translateX(${tabLeft}px)`;
}

// Chạy khởi tạo vị trí sau khi toàn bộ giao diện, font chữ, layout đã load xong
window.addEventListener("load", function () {
  const activeTab = document.querySelector(".hotel-listing__tab--active");
  if (activeTab) {
    moveIndicator(activeTab);
  }
});

tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabs.forEach((t) => t.classList.remove("hotel-listing__tab--active"));
    this.classList.add("hotel-listing__tab--active");
    moveIndicator(this);
  });
});
