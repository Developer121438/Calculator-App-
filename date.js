// ==================================
// DATE CALCULATOR
// ==================================

// Navigation
const menuButton = document.getElementById("date-menu-btn");
const navigation = document.getElementById("date-navigation");

menuButton.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = navigation.classList.toggle("active");

  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (
    !navigation.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    navigation.classList.remove("active");
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

// ==================================
// TAB SWITCHING
// ==================================

const tabs = document.querySelectorAll(".date-tab");
const sections = document.querySelectorAll(".date-section");
const message = document.getElementById("date-message");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
    });

    sections.forEach((section) => {
      section.classList.toggle(
        "active",
        section.id === `${tab.dataset.tab}-section`,
      );
    });

    message.textContent = "";
  });
});

// ==================================
// DATE HELPERS
// ==================================

// Parse an HTML date input as a UTC calendar date.
function parseDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  // Reject invalid dates such as February 30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function daysInMonth(year, monthIndex) {
  const date = new Date(0);
  date.setUTCFullYear(year, monthIndex + 1, 0);
  return date.getUTCDate();
}

// Add calendar months, keeping the day within the destination month.
// Example: January 31 + 1 month = February 28 (in a non-leap year).
function addMonths(date, months) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const target = new Date(0);
  target.setUTCHours(0, 0, 0, 0);
  target.setUTCFullYear(year, month + months, 1);

  const lastDay = daysInMonth(target.getUTCFullYear(), target.getUTCMonth());

  target.setUTCDate(Math.min(day, lastDay));

  return target;
}

// ==================================
// DATE DIFFERENCE
// ==================================

const differenceResult = document.getElementById("difference-result");

document
  .getElementById("calculate-difference")
  .addEventListener("click", () => {
    message.textContent = "";
    differenceResult.hidden = true;

    const start = parseDate(document.getElementById("start-date").value);

    const end = parseDate(document.getElementById("end-date").value);

    if (!start || !end) {
      message.textContent = "Please select both dates.";
      return;
    }

    // Calculate absolute difference, regardless of input order.
    const earlier = start <= end ? start : end;
    const later = start <= end ? end : start;

    const totalDays = Math.round((later - earlier) / 86400000);

    // Find the largest whole number of calendar months.
    let totalMonths =
      (later.getUTCFullYear() - earlier.getUTCFullYear()) * 12 +
      (later.getUTCMonth() - earlier.getUTCMonth());

    while (totalMonths > 0 && addMonths(earlier, totalMonths) > later) {
      totalMonths--;
    }

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const monthEnd = addMonths(earlier, totalMonths);

    const remainingDays = Math.round((later - monthEnd) / 86400000);

    const weeks = Math.floor(remainingDays / 7);
    const days = remainingDays % 7;

    document.getElementById("result-years").textContent = years;
    document.getElementById("result-months").textContent = months;
    document.getElementById("result-weeks").textContent = weeks;
    document.getElementById("result-days").textContent = days;

    document.getElementById("total-days").textContent =
      `Total difference: ${totalDays.toLocaleString()} days`;

    differenceResult.hidden = false;
  });

// ==================================
// ADD / SUBTRACT DATES
// ==================================

const newDateResult = document.getElementById("new-date-result");

document.getElementById("calculate-new-date").addEventListener("click", () => {
  message.textContent = "";
  newDateResult.hidden = true;

  const baseDate = parseDate(document.getElementById("base-date").value);

  if (!baseDate) {
    message.textContent = "Please select a valid date.";
    return;
  }

  const fields = ["add-years", "add-months", "add-weeks", "add-days"];

  const values = fields.map((id) => {
    const input = document.getElementById(id);
    const value = input.value.trim();

    if (!/^\d+$/.test(value)) return null;

    const number = Number(value);

    return Number.isSafeInteger(number) ? number : null;
  });

  if (values.includes(null)) {
    message.textContent = "Please enter valid non-negative whole numbers.";
    return;
  }

  const [years, months, weeks, days] = values;

  const sign =
    document.getElementById("date-operation").value === "subtract" ? -1 : 1;

  // Apply years and months together, then weeks and days.
  const totalMonths = sign * (years * 12 + months);
  const totalDays = sign * (weeks * 7 + days);

  if (!Number.isSafeInteger(totalMonths) || !Number.isSafeInteger(totalDays)) {
    message.textContent = "The entered duration is too large.";
    return;
  }

  const result = addMonths(baseDate, totalMonths);

  result.setUTCDate(result.getUTCDate() + totalDays);

  if (Number.isNaN(result.getTime())) {
    message.textContent = "The calculated date is out of range.";
    return;
  }

  document.getElementById("calculated-date").textContent = formatDate(result);

  newDateResult.hidden = false;
});
