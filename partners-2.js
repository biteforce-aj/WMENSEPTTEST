// Partnerships in Action carousel
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".action-slide");
  const prev = document.getElementById("action-prev");
  const next = document.getElementById("action-next");
  if (!slides.length || !prev || !next) return;

  let current = 0;

  function showSlide(index) {
    slides[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
  }

  prev.addEventListener("click", function () {
    showSlide(current - 1);
  });

  next.addEventListener("click", function () {
    showSlide(current + 1);
  });
});
