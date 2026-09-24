document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.getElementById("navLinks");
  const dropdownContents = document.querySelectorAll(".dropdown-content");

  // Function to reset all dropdown menus to closed state
  function resetDropdowns() {
    dropdownContents.forEach(function (dropdownContent) {
      dropdownContent.style.visibility = "hidden";
      dropdownContent.style.opacity = "0";
      if (window.innerWidth <= 700) {
        dropdownContent.style.display = "none";
      }
    });
  }

  // Global functions for menu control
  window.showMenu = function () {
    navLinks.style.right = "0";
    navLinks.setAttribute("aria-expanded", "true");
  };

  window.hideMenu = function () {
    navLinks.style.right = "-250px";
    navLinks.setAttribute("aria-expanded", "false");
    // Reset all dropdowns when hiding the menu
    resetDropdowns();
  };

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (window.innerWidth <= 700) {
      if (
        navLinks &&
        navLinks.style.right === "0px" &&
        !navLinks.contains(event.target) &&
        !event.target.closest(".fa-bars")
      ) {
        hideMenu();
      }
    }
  });

  // Stop propagation within the menu
  if (navLinks) {
    navLinks.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  // Mobile dropdown handling
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(function (dropdown) {
    const dropbtn = dropdown.querySelector(".dropbtn");
    const dropdownContent = dropdown.querySelector(".dropdown-content");
    let isDropdownOpen = false;
    let wasClickedBefore = false;

    // Initial state for mobile
    if (window.innerWidth <= 700) {
      dropdownContent.style.display = "none";
    }

    dropbtn.addEventListener("click", function (e) {
      if (window.innerWidth <= 700) {
        // First click behavior - toggle dropdown
        if (!wasClickedBefore) {
          e.preventDefault();
          wasClickedBefore = true;

          // Reset after a delay to allow for double-click behavior
          setTimeout(() => {
            wasClickedBefore = false;
          }, 500);

          // Toggle current dropdown
          if (
            window.getComputedStyle(dropdownContent).visibility === "hidden" ||
            window.getComputedStyle(dropdownContent).display === "none"
          ) {
            // Close any other open dropdowns first
            dropdownContents.forEach(function (content) {
              if (content !== dropdownContent) {
                content.style.visibility = "hidden";
                content.style.opacity = "0";
                content.style.display = "none";
              }
            });

            // Open this dropdown
            dropdownContent.style.visibility = "visible";
            dropdownContent.style.opacity = "1";
            dropdownContent.style.display = "block";
            isDropdownOpen = true;
          } else {
            // Close this dropdown if it's already open
            dropdownContent.style.visibility = "hidden";
            dropdownContent.style.opacity = "0";
            dropdownContent.style.display = "none";
            isDropdownOpen = false;
          }
        } else {
          // Second click - navigate to the href
          wasClickedBefore = false;
          // Let the default link behavior happen - don't prevent default
        }
      }
    });
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      // Reset mobile menu when resizing back to desktop
      navLinks.style.right = "-250px";

      // For desktop, ensure dropdown menus use visibility/opacity but not display
      dropdownContents.forEach((content) => {
        content.style.display = "";
      });
    } else {
      // For mobile, ensure dropdowns are properly hidden with display:none
      resetDropdowns();
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const dots = document.querySelectorAll(".dot");
  const arrows = document.querySelectorAll(".arrow");

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveDot(index);
    });
  });

  let currentIndex = 0;
  arrows[0].addEventListener("click", () => {
    currentIndex = currentIndex === 0 ? dots.length - 1 : currentIndex - 1;
    setActiveDot(currentIndex);
  });

  arrows[1].addEventListener("click", () => {
    currentIndex = currentIndex === dots.length - 1 ? 0 : currentIndex + 1;
    setActiveDot(currentIndex);
  });

  function setActiveDot(index) {
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const prevButton = document.querySelector(".arrow.prev");
  const nextButton = document.querySelector(".arrow.next");

  let currentIndex = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentIndex = index;
  }

  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= slides.length) {
      newIndex = 0;
    }
    showSlide(newIndex);
  }

  function prevSlide() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = slides.length - 1;
    }
    showSlide(newIndex);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      showSlide(index);
      resetInterval();
    });
  });

  prevButton.addEventListener("click", function () {
    prevSlide();
    resetInterval();
  });

  nextButton.addEventListener("click", function () {
    nextSlide();
    resetInterval();
  });

  function startInterval() {
    interval = setInterval(nextSlide, 5000);
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  startInterval();
});

// 2. Replace your entire JavaScript with this simpler version
const openPopupBtn = document.querySelector(".hero-btn");
const closePopupBtn = document.getElementById("close-popup-btn");
const popup = document.getElementById("newsletter-popup");
const newsletterForm = document.getElementById("newsletter-form");
const popupContainer = document.querySelector(".popup-container");
const allInputs = document.querySelectorAll(".form-control");
let scrollPosition = 0;

// Open Popup Function
function openPopup(e) {
  if (e) e.preventDefault();

  // Store current scroll position
  scrollPosition = window.pageYOffset;

  // Lock body scroll
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  popup.style.display = "flex";

  // Add iOS-specific class for Safari detection
  if (isIOS()) {
    document.body.classList.add("ios-device");
    popupContainer.classList.add("ios-container");
  }
}

function closePopup() {
  // Restore scrolling
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";

  // Restore scroll position
  window.scrollTo(0, scrollPosition);

  popup.style.display = "none";

  // Remove iOS classes
  document.body.classList.remove("ios-device");
  popupContainer.classList.remove("ios-container");
}

function handleSubmit(e) {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;

  if (!firstName || !lastName || !email) {
    alert("Please fill in all fields");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address");
    return;
  }

  console.log("Form submitted:", { firstName, lastName, email });
  alert("Thank you for subscribing!");
  closePopup();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// CRITICAL: Prevent form disappearing on input focus
allInputs.forEach((input) => {
  // Prevent any event bubbling that might reach the overlay
  input.addEventListener(
    "touchstart",
    (e) => {
      e.stopPropagation();
    },
    { passive: false }
  );

  input.addEventListener("focus", (e) => {
    e.stopPropagation();
    // Force popup to stay visible on focus
    popup.style.display = "flex";
  });
});

// Block events on the popup container from bubbling to the overlay
popupContainer.addEventListener(
  "touchstart",
  (e) => {
    e.stopPropagation();
  },
  { passive: false }
);

popupContainer.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close only when specifically clicking the close button
closePopupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closePopup();
});

// Only close if clicking directly on the overlay (not any of its children)
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopup();
  }
});

// Form submission
newsletterForm.addEventListener("submit", handleSubmit);

// Open popup button
openPopupBtn.addEventListener("click", openPopup);

// Escape key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && popup.style.display === "flex") {
    closePopup();
  }
});
// This fixes iOS specific issues
document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".form-control");

  inputs.forEach((input) => {
    input.addEventListener(
      "touchstart",
      function (e) {
        e.stopPropagation();
      },
      { passive: false }
    );

    input.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
});

// It handles the mobile menu functionality
