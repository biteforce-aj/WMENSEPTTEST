// Partnership stories tabs
document.addEventListener("DOMContentLoaded", function () {
  const tabs = Array.from(document.querySelectorAll(".p3-tab"));
  if (!tabs.length) return;

  function selectTab(tab) {
    tabs.forEach(function (t) {
      const selected = t === tab;
      t.setAttribute("aria-selected", selected ? "true" : "false");
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      selectTab(tab);
    });

    // Arrow keys move between tabs
    tab.addEventListener("keydown", function (e) {
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });
});
