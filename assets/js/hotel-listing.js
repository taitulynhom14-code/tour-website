const sliderMin = document.getElementById("slider-min");
const sliderMax = document.getElementById("slider-max");
const sliderFill = document.getElementById("slider-fill");
const labelMin = document.getElementById("label-min");
const labelMax = document.getElementById("label-max");

const minGap = 210; // Khoảng cách giá tối thiểu

// Hàm chỉ làm nhiệm vụ vẽ lại giao diện
function updateSliderUI() {
  let minVal = parseInt(sliderMin.value);
  let maxVal = parseInt(sliderMax.value);

  // Cập nhật chữ số
  labelMin.textContent = "$" + minVal;
  labelMax.textContent = "$" + maxVal;

  // Tính phần trăm vị trí
  const minPercent = ((minVal - sliderMin.min) / (sliderMin.max - sliderMin.min)) * 100;
  const maxPercent = ((maxVal - sliderMax.min) / (sliderMax.max - sliderMax.min)) * 100;

  // Cập nhật thanh màu xanh
  sliderFill.style.left = minPercent + "%";
  sliderFill.style.width = maxPercent - minPercent + "%";

  // Cập nhật vị trí của chữ số (đã căn giữa chuẩn)
  // labelMin.style.left = `calc(${minPercent}% - ${minPercent * 0.2}px)`;
  // labelMax.style.left = "auto";
  // labelMax.style.right = `calc(${100 - maxPercent}% - ${(100 - maxPercent) * 0.2}px)`;
}

// Xử lý riêng khi người dùng kéo cục bên TRÁI
sliderMin.addEventListener("input", function () {
  let minVal = parseInt(sliderMin.value);
  let maxVal = parseInt(sliderMax.value);

  // Nếu cố tình kéo cục trái vượt qua (cục phải - 100) thì chặn lại ngay
  if (maxVal - minVal < minGap) {
    sliderMin.value = maxVal - minGap;
  }
  updateSliderUI();
});

// Xử lý riêng khi người dùng kéo cục bên PHẢI
sliderMax.addEventListener("input", function () {
  let minVal = parseInt(sliderMin.value);
  let maxVal = parseInt(sliderMax.value);

  // Nếu cố tình kéo cục phải lùi về vượt qua (cục trái + 100) thì chặn lại ngay
  if (maxVal - minVal < minGap) {
    sliderMax.value = minVal + minGap;
  }
  updateSliderUI();
});

// Chạy 1 lần khi load trang để setup
updateSliderUI();
